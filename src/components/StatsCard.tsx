import { motion } from 'framer-motion'
import type { Tracker } from '../lib/storage'
import { computeStats } from '../lib/stats'

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center rounded-2xl bg-cream/70 px-2 py-3">
      <span className="font-display text-2xl font-bold leading-none text-mocha">{value}</span>
      <span className="mt-1 text-center font-body text-[0.6rem] font-bold uppercase tracking-[0.08em] text-mocha-muted">
        {label}
      </span>
    </div>
  )
}

/** Motivating at-a-glance numbers for the active person. */
export default function StatsCard({ tracker }: { tracker: Tracker }) {
  const stats = computeStats(tracker.isDone, tracker.doneDates())
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-card bg-cream-card/80 p-3 shadow-soft"
    >
      <div className="flex items-stretch gap-2">
        <Stat value={String(stats.current)} label="Streak" />
        <Stat value={String(stats.longest)} label="Best" />
        <Stat value={String(stats.total)} label="Total" />
        <Stat value={`${stats.weekDone}/${stats.weekTotal}`} label="This week" />
      </div>
    </motion.div>
  )
}
