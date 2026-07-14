import { Star } from 'lucide-react'

const REPO_URL = `https://github.com/${
  import.meta.env.VITE_GITHUB_REPO ?? 'HichemTab-tech/image-to-link'
}`

export function StarButton() {
  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noreferrer"
      className="star-button group relative inline-flex h-10 items-center gap-2.5 overflow-hidden rounded-xl border border-border bg-secondary/60 px-5 text-sm font-semibold text-foreground no-underline transition-all duration-200 hover:border-amber-400/60 hover:bg-secondary active:scale-[0.98]"
    >
      <span className="star-button-shine" aria-hidden />
      <span className="relative grid place-items-center">
        <Star className="size-4 text-amber-400 transition-transform duration-300 group-hover:rotate-[72deg] group-hover:scale-125 group-hover:fill-amber-400" />
        <span className="star-sparkle" aria-hidden />
      </span>
      <span className="relative">Enjoying it? Star on GitHub</span>
    </a>
  )
}
