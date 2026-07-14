import { createFileRoute } from '@tanstack/react-router'
import { Uploader } from '#/components/Uploader'
import { getUploadConfig } from '#/lib/upload-config'

export const Route = createFileRoute('/')({
  loader: () => getUploadConfig(),
  component: Home,
})

function Home() {
  const { maxUploadMb, ttlSeconds } = Route.useLoaderData()
  const ttlLabel =
    ttlSeconds < 60
      ? `${ttlSeconds} seconds`
      : `${Math.round(ttlSeconds / 60)} ${Math.round(ttlSeconds / 60) === 1 ? 'minute' : 'minutes'}`

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-10">
      <div className="max-w-2xl space-y-5 text-center animate-in fade-in slide-in-from-bottom-3 duration-500">
        <span className="label-caps inline-flex items-center gap-2 rounded-full border-2 border-ink bg-paper-bright px-4 py-1.5 text-muted-foreground shadow-[2px_2px_0_var(--ink)]">
          No account · no tracking · auto-shredded
        </span>
        <h1 className="font-serif text-balance text-5xl font-bold tracking-tight text-ink sm:text-6xl">
          Image in. Link out.{' '}
          <em className="font-medium italic text-stamp">Poof.</em>
        </h1>
        <p className="mx-auto max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
          Drop, paste or pick an image — get a shareable link instantly. It
          self-destructs after {ttlLabel}, then the image is gone for good.
        </p>
      </div>

      <Uploader maxUploadMb={maxUploadMb} />
    </div>
  )
}
