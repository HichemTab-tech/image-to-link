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
      className="star-sticker inline-flex h-10 items-center gap-2.5 rounded-full border-2 border-stamp bg-paper-bright px-5 text-xs font-bold uppercase tracking-widest text-stamp no-underline shadow-[2px_3px_0_rgba(38,33,26,0.3)]"
    >
      <Star className="star-icon size-4 fill-stamp" />
      <span>Enjoying it? Star it on GitHub</span>
    </a>
  )
}
