import {Github, Link2} from 'lucide-react'

const REPO_URL = `https://github.com/${
    import.meta.env.VITE_GITHUB_REPO ?? 'HichemTab-tech/image-to-link'
}`

export function SiteHeader() {
    return (
        <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
            <a href="/" className="flex items-center gap-3 text-ink no-underline">
        <span
            className="grid size-9 place-items-center rounded-lg border-2 border-ink bg-stamp text-paper-bright shadow-[2px_2px_0_var(--ink)]">
          <Link2 className="size-4.5"/>
        </span>
                <span className="font-serif text-xl font-bold tracking-tight">
          image<span className="text-stamp">→</span>link
        </span>
            </a>
            <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="View source on GitHub"
                className="grid size-9 place-items-center rounded-lg border-2 border-ink bg-paper-bright text-ink shadow-[2px_2px_0_var(--ink)] transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0"
            >
                <Github className="size-4.5"/>
            </a>
        </header>
    )
}
