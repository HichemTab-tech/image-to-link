import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { SiteFooter } from '#/components/SiteFooter'
import { SiteHeader } from '#/components/SiteHeader'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'image→link — instant temporary image links' },
      {
        name: 'description',
        content:
          'Drop, paste or upload an image and get a shareable link that self-destructs after a few minutes.',
      },
      { name: 'theme-color', content: '#0b0e17' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="flex min-h-dvh flex-col">
          <SiteHeader />
          <main className="flex flex-1 flex-col">{children}</main>
          <SiteFooter />
        </div>
        <Scripts />
      </body>
    </html>
  )
}
