import {createFileRoute} from '@tanstack/react-router'
import {openImage} from '#/lib/server/storage'

export const Route = createFileRoute('/i/$file')({
    server: {
        handlers: {
            GET: async ({params}) => {
                const image = await openImage(params.file)
                if (!image) {
                    return new Response('This link has expired or never existed.', {
                        status: 404,
                        headers: {'content-type': 'text/plain; charset=utf-8'},
                    })
                }

                const remainingSeconds = Math.max(
                    0,
                    Math.floor((image.expiresAt - Date.now()) / 1000),
                )
                return new Response(image.stream, {
                    headers: {
                        'content-type': image.mime,
                        'content-length': String(image.size),
                        'cache-control': `public, max-age=${remainingSeconds}`,
                        'content-disposition': 'inline',
                        // Neutralizes scripts in SVG uploads.
                        'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'",
                        'x-content-type-options': 'nosniff',
                    },
                })
            },
        },
    },
})
