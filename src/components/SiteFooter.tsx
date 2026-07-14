export function SiteFooter() {
  return (
    <footer className="mx-auto flex w-full max-w-5xl items-center justify-center px-6 py-8">
      <a
        href="https://hichemtab-tech.me"
        target="_blank"
        rel="noreferrer"
        className="group flex items-center gap-3 rounded-full border-2 border-ink bg-paper-bright py-1.5 pl-2 pr-4 text-ink no-underline shadow-[2px_2px_0_var(--ink)] transition-transform duration-150 hover:-translate-y-0.5"
      >
        <img
          src="https://github.com/HichemTab-tech.png?size=64"
          alt="HichemTab-tech"
          width={28}
          height={28}
          loading="lazy"
          className="size-7 rounded-full border-2 border-ink"
        />
        <span className="text-xs text-muted-foreground">
          Made by{' '}
          <span className="font-bold text-ink transition-colors group-hover:text-stamp">
            HichemTab-tech
          </span>
        </span>
      </a>
    </footer>
  )
}
