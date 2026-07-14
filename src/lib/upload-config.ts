import {createServerFn} from '@tanstack/react-start'

export const getUploadConfig = createServerFn({method: 'GET'}).handler(
    async () => {
        const {MAX_UPLOAD_MB, TTL_SECONDS} = await import('#/lib/server/storage')
        return {maxUploadMb: MAX_UPLOAD_MB, ttlSeconds: TTL_SECONDS}
    },
)
