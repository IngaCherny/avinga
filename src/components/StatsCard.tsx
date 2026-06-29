import { motion } from 'framer-motion'
import type { Tracker } from '../lib/storage'
import { computeStats } from '../lib/stats'

/** Streak-focused motivation for the active person. */
export default function StatsCard({ tracker }: { tracker: Tracker }) {
  const stats = computeStats(tracker.isDone)
  const message =
    stats.current === 0 ? 'start your streak today' : 'keep it going!'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between gap-4 rounded-card bg-cream-card/80 px-5 py-4 shadow-soft"
    >
      <div className="flex items-baseline gap-2">
        <span className="font-display text-4xl font-bold leading-none text-mocha">
          {stats.current}
        </span>
        <div className="leading-tight">
          <p className="font-body text-xs font-bold uppercase tracking-[0.1em] text-mocha-muted">
            day streak
          </p>
          <p className="font-body text-xs font-semibold text-rose-deep">{message}</p>
        </div>
      </div>
      <div className="text-right">
        <span className="font-display text-2xl font-bold leading-none text-mocha">
          {stats.weekDone}/{stats.weekTotal}
        </span>
        <p className="mt-1 font-body text-[0.6rem] font-bold uppercase tracking-[0.1em] text-mocha-muted">
          this week
        </p>
      </div>
    </motion.div>
  )
}
