import { motion } from 'framer-motion'
import type { Tracker } from '../lib/storage'
import {
  PROGRAM_START,
  PROGRAM_TOTAL,
  phaseLabel,
  programInfoForDay,
} from '../data/schedule'
import { addDays, dateLabel, daysBetween, parseISO, toISO, today } from '../lib/dates'

/** Every program date, Day 1 → Day 56, for counting completed sessions. */
const ALL_DATES = Array.from({ length: PROGRAM_TOTAL }, (_, i) =>
  toISO(addDays(parseISO(PROGRAM_START), i)),
)

/**
 * A prominent banner for the 8-week LIIFT MORE program: counts down before it
 * starts, shows Day N of 56 with a progress bar during, and celebrates after.
 */
export default function ProgramBanner({ tracker }: { tracker: Tracker }) {
  const start = parseISO(PROGRAM_START)
  const end = addDays(start, PROGRAM_TOTAL - 1)
  const now = today()
  const done = tracker.countDone(ALL_DATES)

  let phase: 'before' | 'during' | 'after'
  if (now < start) phase = 'before'
  else if (now > end) phase = 'after'
  else phase = 'during'

  const dayNum = Math.min(PROGRAM_TOTAL, Math.max(1, daysBetween(start, now) + 1))
  const info = programInfoForDay(dayNum)
  const pct =
    phase === 'before' ? 0 : phase === 'after' ? 100 : Math.round((dayNum / PROGRAM_TOTAL) * 100)

  let heading: string
  let sub: string
  if (phase === 'before') {
    const until = daysBetween(now, start)
    heading = 'LIIFT MORE · 8 weeks'
    sub =
      until === 0 ? 'starts today — let’s go!' : `starts in ${until} day${until === 1 ? '' : 's'} · ${dateLabel(start)}`
  } else if (phase === 'after') {
    heading = 'LIIFT MORE complete'
    sub = `${done} workouts logged · you finished all 8 weeks 🎉`
  } else {
    heading = `Day ${dayNum} of ${PROGRAM_TOTAL} · Week ${info?.week ?? 1}`
    sub = `${info ? phaseLabel(info.phase) : ''} · ${done} logged`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-card bg-gradient-to-br from-accent/20 to-shoulders/15 p-4 shadow-soft"
    >
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-display text-base font-bold text-mocha sm:text-lg">{heading}</p>
        <span className="font-display text-sm font-bold text-accent">{pct}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-pill bg-cream/70">
        <motion.div
          className="h-full rounded-pill bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 90, damping: 18 }}
        />
      </div>
      <p className="mt-2 font-body text-xs font-semibold text-mocha-soft">{sub}</p>
    </motion.div>
  )
}
