import {createServerFn} from '@tanstack/react-start'

export const getSiteOrigin = createServerFn({method: 'GET'}).handler(
    async () => {
        const [{getRequest}, {publicOrigin}] = await Promise.all([
            import('@tanstack/react-start/server'),
            import('#/lib/server/origin'),
        ])
        return publicOrigin(getRequest())
    },
)
