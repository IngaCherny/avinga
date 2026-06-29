import { motion } from 'framer-motion'
import type { Tracker } from '../lib/storage'
import { CHALLENGE_BY_DATE, CHALLENGE_START, CHALLENGE_TOTAL } from '../data/challenge'
import { addDays, dateLabel, daysBetween, parseISO, today } from '../lib/dates'

const ALL_DATES = Object.keys(CHALLENGE_BY_DATE)

/**
 * A prominent banner for the 560 Challenge: counts down before it starts,
 * shows Day N of 60 with a progress bar during, and celebrates after.
 */
export default function ChallengeBanner({ tracker }: { tracker: Tracker }) {
  const start = parseISO(CHALLENGE_START)
  const end = addDays(start, CHALLENGE_TOTAL - 1)
  const now = today()
  const done = tracker.countDone(ALL_DATES)

  let phase: 'before' | 'during' | 'after'
  if (now < start) phase = 'before'
  else if (now > end) phase = 'after'
  else phase = 'during'

  const dayNum = Math.min(CHALLENGE_TOTAL, Math.max(1, daysBetween(start, now) + 1))
  const pct =
    phase === 'before' ? 0 : phase === 'after' ? 100 : Math.round((dayNum / CHALLENGE_TOTAL) * 100)

  let heading: string
  let sub: string
  if (phase === 'before') {
    const until = daysBetween(now, start)
    heading = '560 Challenge'
    sub = until === 0 ? 'starts today!' : `starts in ${until} day${until === 1 ? '' : 's'} · ${dateLabel(start)}`
  } else if (phase === 'after') {
    heading = '560 Challenge complete'
    sub = `${done} workouts logged · incredible work`
  } else {
    const left = CHALLENGE_TOTAL - dayNum
    heading = `560 Challenge · Day ${dayNum} of ${CHALLENGE_TOTAL}`
    sub = `${done} logged · ${left} day${left === 1 ? '' : 's'} to go`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-card bg-gradient-to-br from-wildcard/25 to-belle/20 p-4 shadow-soft"
    >
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-display text-base font-bold text-mocha sm:text-lg">{heading}</p>
        <span className="font-display text-sm font-bold text-wildcard">{pct}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-pill bg-cream/70">
        <motion.div
          className="h-full rounded-pill bg-wildcard"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 90, damping: 18 }}
        />
      </div>
      <p className="mt-2 font-body text-xs font-semibold text-mocha-soft">{sub}</p>
    </motion.div>
  )
}
