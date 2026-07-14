import { createFileRoute } from '@tanstack/react-router'
import {
  MAX_UPLOAD_MB,
  TTL_SECONDS,
  isSupportedImageType,
  saveImage,
  supportedMimeTypes,
  sweepExpired,
} from '#/lib/server/storage'

function jsonError(status: number, message: string) {
  return Response.json({ error: message }, { status })
}

function publicOrigin(request: Request): string {
  const configured = process.env.PUBLIC_BASE_URL
  if (configured) return configured.replace(/\/+$/, '')

  const url = new URL(request.url)
  const proto = request.headers.get('x-forwarded-proto') ?? url.protocol.replace(':', '')
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? url.host
  return `${proto}://${host}`
}

export const Route = createFileRoute('/api/upload')({
  server: {
    handlers: {
      POST: async ({ request }) => {
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

        // Opportunistic cleanup alongside the interval sweeper.
        sweepExpired().catch(() => {})

        const { fileId, expiresAt } = await saveImage(file)
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
