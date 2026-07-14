import {createRootRoute, HeadContent, Scripts} from '@tanstack/react-router'
import {SiteFooter} from '#/components/SiteFooter'
import {SiteHeader} from '#/components/SiteHeader'
import {getSiteOrigin} from '#/lib/site-origin'

import appCss from '../styles.css?url'
import type {ReactNode} from "react";

const SITE_NAME = 'image→link'
const TITLE = 'image→link — instant temporary image links'
const DESCRIPTION =
    'Drop, paste or upload an image and get a shareable link that self-destructs after a few minutes.'
const OG_IMAGE_ALT =
    'image→link — Image in. Link out. Poof. Shareable image links that self-destruct after 5 minutes.'

export const Route = createRootRoute({
    loader: () => getSiteOrigin(),
    head: ({loaderData: origin}) => {
        const url = origin ? `${origin}/` : '/'
        const ogImage = origin ? `${origin}/meta.png` : '/meta.png'
        return {
            meta: [
                {charSet: 'utf-8'},
                {name: 'viewport', content: 'width=device-width, initial-scale=1'},
                {title: TITLE},
                {name: 'description', content: DESCRIPTION},
                {name: 'theme-color', content: '#f2e9d8'},
                // Open Graph
                {property: 'og:type', content: 'website'},
                {property: 'og:site_name', content: SITE_NAME},
                {property: 'og:title', content: TITLE},
                {property: 'og:description', content: DESCRIPTION},
                {property: 'og:url', content: url},
                {property: 'og:image', content: ogImage},
                {property: 'og:image:type', content: 'image/png'},
                {property: 'og:image:width', content: '1200'},
                {property: 'og:image:height', content: '628'},
                {property: 'og:image:alt', content: OG_IMAGE_ALT},
                {property: 'og:locale', content: 'en_US'},
                // Twitter / X
                {name: 'twitter:card', content: 'summary_large_image'},
                {name: 'twitter:title', content: TITLE},
                {name: 'twitter:description', content: DESCRIPTION},
                {name: 'twitter:image', content: ogImage},
                {name: 'twitter:image:alt', content: OG_IMAGE_ALT},
            ],
            links: [
                {rel: 'stylesheet', href: appCss},
                {rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml'},
                {rel: 'manifest', href: '/manifest.json'},
                {rel: 'canonical', href: url},
            ],
            scripts: [
                {
                    type: 'application/ld+json',
                    children: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'WebApplication',
                        name: SITE_NAME,
                        url,
                        description: DESCRIPTION,
                        applicationCategory: 'UtilityApplication',
                        operatingSystem: 'Web',
                        image: ogImage,
                        offers: {'@type': 'Offer', price: '0'},
                        author: {
                            '@type': 'Person',
                            name: 'HichemTab-tech',
                            url: 'https://hichemtab-tech.me',
                        },
                    }),
                },
            ],
        }
    },
    shellComponent: RootDocument,
})

function RootDocument({children}: { children: ReactNode }) {
    // noinspection HtmlRequiredTitleElement
    return (
        <html lang="en">
        <head>
            <HeadContent/>
        </head>
        <body>
        <div className="flex min-h-dvh flex-col">
            <SiteHeader/>
            <main className="flex flex-1 flex-col">{children}</main>
            <SiteFooter/>
        </div>
        <Scripts/>
        </body>
        </html>
    )
}
