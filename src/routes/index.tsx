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
      <div className="max-w-2xl space-y-4 text-center animate-in fade-in slide-in-from-bottom-3 duration-500">
        <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary/40 px-3.5 py-1 text-xs font-medium text-muted-foreground">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          No account · no tracking · auto-deleted
        </span>
        <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
          Image to link,{' '}
          <span className="bg-gradient-to-r from-primary via-[var(--accent-2)] to-primary bg-clip-text text-transparent">
            in one drop
          </span>
        </h1>
        <p className="mx-auto max-w-md text-pretty text-base text-muted-foreground">
          Drop, paste or pick an image — get a shareable link instantly. It
          self-destructs after {ttlLabel}, then the image is gone for good.
        </p>
      </div>

      <Uploader maxUploadMb={maxUploadMb} />
    </div>
  )
}
