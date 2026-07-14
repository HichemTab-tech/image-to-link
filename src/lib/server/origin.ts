export function publicOrigin(request: Request): string {
    const configured = process.env.PUBLIC_BASE_URL
    if (configured) return configured.replace(/\/+$/, '')

    const url = new URL(request.url)
    const proto = request.headers.get('x-forwarded-proto') ?? url.protocol.replace(':', '')
    const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? url.host
    return `${proto}://${host}`
}
