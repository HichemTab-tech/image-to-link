import { Github, Link2 } from 'lucide-react'

const REPO_URL = `https://github.com/${
  import.meta.env.VITE_GITHUB_REPO ?? 'HichemTab-tech/image-to-link'
}`

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
      <a href="/" className="flex items-center gap-3 no-underline">
        <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-[var(--accent-2)] text-primary-foreground shadow-[0_4px_18px_-4px_var(--glow)]">
          <Link2 className="size-4.5" />
        </span>
        <span className="text-base font-bold tracking-tight text-foreground">
          image<span className="text-primary">→</span>link
        </span>
      </a>
      <a
        href={REPO_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="View source on GitHub"
        className="grid size-9 place-items-center rounded-xl border border-border bg-secondary/50 text-muted-foreground transition-colors hover:text-foreground"
      >
        <Github className="size-4.5" />
      </a>
    </header>
  )
}
