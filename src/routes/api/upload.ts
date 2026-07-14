import {createFileRoute} from '@tanstack/react-router'
import {
    isSupportedImageType,
    MAX_STORAGE_MB,
    MAX_UPLOAD_MB,
    saveImage,
    supportedMimeTypes,
    sweepExpired,
    TTL_SECONDS,
    usedStorageBytes,
} from '#/lib/server/storage'
import {publicOrigin} from '#/lib/server/origin'

function ttlLabel(): string {
    return TTL_SECONDS < 60
        ? `${TTL_SECONDS} seconds`
        : `${Math.round(TTL_SECONDS / 60)} minutes`
}

function jsonError(status: number, message: string) {
    return Response.json({error: message}, {status})
}

export const Route = createFileRoute('/api/upload')({
    server: {
        handlers: {
            POST: async ({request}) => {
                const maxBytes = MAX_UPLOAD_MB * 1024 * 1024
                const declaredSize = Number(request.headers.get('content-length') ?? 0)
                if (declaredSize > maxBytes + 64 * 1024) {
                    return jsonError(413, `Image is too large (max ${MAX_UPLOAD_MB} MB).`)
                }

                let form: FormData
                try {
                    form = await request.formData()
                } catch {
                    return jsonError(400, 'Expected multipart form data.')
                }

                const file = form.get('file')
                if (!(file instanceof File) || file.size === 0) {
                    return jsonError(400, 'No image received.')
                }
                if (file.size > maxBytes) {
                    return jsonError(413, `Image is too large (max ${MAX_UPLOAD_MB} MB).`)
                }
                if (!isSupportedImageType(file.type)) {
                    return jsonError(
                        415,
                        `Unsupported image type. Allowed: ${supportedMimeTypes().join(', ')}`,
                    )
                }

                // Opportunistic cleanup alongside the interval sweeper — do it
                // before the capacity check so expired files free their space.
                await sweepExpired().catch(() => {
                })

                const used = await usedStorageBytes()
                if (used + file.size > MAX_STORAGE_MB * 1024 * 1024) {
                    return jsonError(
                        507,
                        `We're at full capacity right now — every link expires after ${ttlLabel()}, so space frees itself. Try again in a few minutes.`,
                    )
                }

                let saved
                try {
                    saved = await saveImage(file)
                } catch {
                    return jsonError(
                        415,
                        'File content does not match its declared image type.',
                    )
                }
                const {fileId, expiresAt} = saved
                return Response.json({
                    url: `${publicOrigin(request)}/i/${fileId}`,
                    fileId,
                    expiresAt,
                    ttlSeconds: TTL_SECONDS,
                })
            },
        },
    },
})
