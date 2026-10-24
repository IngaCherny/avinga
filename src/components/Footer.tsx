import { FOOTER_NOTE } from '../data/schedule'
import { BUILD_ID } from '../lib/updates'

export default function Footer() {
  return (
    <footer className="mt-10 flex flex-col items-center justify-center gap-1 pb-8 text-center">
      <p className="font-body text-sm font-semibold text-mocha-soft">{FOOTER_NOTE}</p>
      {/* So "is my app up to date?" has an answer you can read off the screen. */}
      <p className="font-body text-[0.6rem] uppercase tracking-[0.14em] text-mocha-muted/70">
        build {BUILD_ID}
      </p>
    </footer>
  )
}
