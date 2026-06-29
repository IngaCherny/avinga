import { motion } from 'framer-motion'
import { QUOTES, pickByDate } from '../data/quotes'

/** The "quote of the day", a new motivational line each day. */
export default function QuoteCard({ isoDate }: { isoDate: string }) {
  const quote = pickByDate(QUOTES, isoDate)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-card bg-gradient-to-br from-rose-soft/40 to-peach-light/40 px-5 py-4 shadow-soft"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -left-1 -top-4 font-display text-7xl leading-none text-rose/30"
      >
        “
      </span>
      <p className="font-body text-[0.6rem] font-bold uppercase tracking-[0.18em] text-rose-deep">
        today’s spark
      </p>
      <p className="relative mt-1.5 font-display text-base font-medium leading-snug text-mocha sm:text-lg">
        {quote.text}
      </p>
      {quote.by && (
        <p className="mt-1 text-right font-body text-xs italic text-mocha-muted">{quote.by}</p>
      )}
    </motion.div>
  )
}
