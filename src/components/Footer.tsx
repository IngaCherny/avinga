import { FOOTER_NOTE } from '../data/schedule'

export default function Footer() {
  return (
    <footer className="mt-10 flex items-center justify-center gap-2 pb-8 text-center">
      <p className="font-body text-sm font-semibold text-mocha-soft">{FOOTER_NOTE}</p>
    </footer>
  )
}
