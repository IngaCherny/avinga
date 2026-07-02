import { motion } from 'framer-motion'
import type { WeeklyChallenge } from '../data/schedule'

/** A simple line-drawn droplet, stroked in the current text color. */
function DropletIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M12 3.4c3.3 3.8 5.6 6.8 5.6 9.7a5.6 5.6 0 0 1-11.2 0c0-2.9 2.3-5.9 5.6-9.7Z" />
    </svg>
  )
}

/**
 * The week's nutrition / habit challenge, shown above the training cards in the
 * Weekly view and on the Today dashboard.
 */
export default function NutritionCard({ challenge }: { challenge: WeeklyChallenge }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-card bg-gradient-to-br from-peach-light/45 to-cream-card px-5 py-4 shadow-soft"
    >
      <div className="flex items-start gap-3.5">
        <span
          aria-hidden
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cream-card text-mocha-soft shadow-soft"
        >
          <DropletIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="font-body text-[0.6rem] font-bold uppercase tracking-[0.18em] text-mocha-muted">
            weekly challenge
          </p>
          <p className="mt-1 font-display text-base font-semibold leading-snug text-mocha sm:text-lg">
            {challenge.title}
          </p>
          <p className="mt-1 font-body text-sm leading-snug text-mocha-soft">{challenge.detail}</p>
        </div>
      </div>
    </motion.div>
  )
}
