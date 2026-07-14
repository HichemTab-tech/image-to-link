export function SiteFooter() {
  return (
    <footer className="mx-auto flex w-full max-w-5xl items-center justify-center px-6 py-8">
      <a
        href="https://hichemtab-tech.me"
        target="_blank"
        rel="noreferrer"
        className="group flex items-center gap-3 rounded-full border border-border/70 bg-card/50 py-1.5 pl-2 pr-4 no-underline backdrop-blur transition-all duration-200 hover:border-primary/50 hover:bg-card"
      >
        <img
          src="https://github.com/HichemTab-tech.png?size=64"
          alt="HichemTab-tech"
          width={28}
          height={28}
          loading="lazy"
          className="size-7 rounded-full border border-border"
        />
        <span className="text-xs text-muted-foreground">
          Made by{' '}
          <span className="font-semibold text-foreground transition-colors group-hover:text-primary">
            HichemTab-tech
          </span>
        </span>
      </a>
    </footer>
  )
}
