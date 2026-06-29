interface Props {
  href: string
  /** 'sm' for compact cards, 'md' for the hero. */
  size?: 'sm' | 'md'
}

/** A pill link that opens the workout video in a new tab. */
export default function WatchLink({ href, size = 'sm' }: Props) {
  const pad = size === 'md' ? 'px-4 py-1.5 text-xs' : 'px-2.5 py-1 text-[0.62rem]'
  const dim = size === 'md' ? 'h-3 w-3' : 'h-2.5 w-2.5'
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-pill bg-mocha font-body font-bold uppercase tracking-wide text-cream shadow-pill transition-transform hover:scale-105 active:scale-95 ${pad}`}
    >
      <svg viewBox="0 0 24 24" className={`${dim} fill-current`} aria-hidden>
        <path d="M5 3l15 9-15 9z" />
      </svg>
      Watch
    </a>
  )
}
