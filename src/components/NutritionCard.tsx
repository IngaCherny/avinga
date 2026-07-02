import { motion } from 'framer-motion'
import type { WeeklyChallenge } from '../data/schedule'

/**
 * The week's nutrition / habit challenge, shown above the training cards in the
 * Weekly view. Only rendered when a challenge exists for the viewed week.
 */
export default function NutritionCard({ challenge }: { challenge: WeeklyChallenge }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-card bg-gradient-to-br from-yoga/25 to-cream-card px-5 py-4 shadow-soft"
    >
      <div className="flex items-start gap-3.5">
        <span
          aria-hidden
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cream-card text-2xl shadow-soft"
        >
          {challenge.emoji}
        </span>
        <div className="min-w-0">
          <p className="font-body text-[0.6rem] font-bold uppercase tracking-[0.18em] text-yoga">
            this week’s challenge
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
