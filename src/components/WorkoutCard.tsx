import { motion } from 'framer-motion'
import type { ScheduledDay } from '../data/types'
import type { Weights } from '../lib/weights'
import DayBadge from './DayBadge'
import MethodTag from './MethodTag'
import CheckCircle from './CheckCircle'
import WatchLink from './WatchLink'
import LogButton from './LogButton'

interface Props {
  day: ScheduledDay
  done: boolean
  onToggle: () => void
  isToday?: boolean
  weights: Weights
}

/** One day's card in the weekly list. */
export default function WorkoutCard({ day, done, onToggle, isToday, weights }: Props) {
  const rest = day.method === 'rest'

  return (
    <motion.div
      layout
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0 },
      }}
      className={`relative flex items-center gap-3 rounded-card px-3.5 py-4 sm:gap-4 sm:px-6 sm:py-5 ${
        rest
          ? 'bg-cream-deep/80 shadow-none'
          : 'bg-cream-card shadow-card'
      } ${isToday ? 'ring-2 ring-accent/70 ring-offset-2 ring-offset-cream' : ''} ${
        done && !rest ? 'opacity-80' : ''
      }`}
    >
      {isToday && (
        <span className="absolute -top-2.5 left-5 rounded-pill bg-accent px-2.5 py-0.5 font-body text-[0.58rem] font-bold uppercase tracking-[0.14em] text-white shadow-pill">
          Today
        </span>
      )}

      <DayBadge method={day.method} label={day.dayShort} />

      {/* day + date */}
      <div className="w-[6.25rem] shrink-0 sm:w-32">
        <p className="font-display text-base font-semibold leading-tight text-mocha sm:text-xl">
          {day.dayName}
        </p>
        <p className="font-body text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-mocha-muted">
          {day.dateLabel}
        </p>
      </div>

      {/* workout */}
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1.5">
        {rest ? (
          <p className="font-display text-base italic text-mocha-muted sm:text-lg">
            rest &amp; restore <span className="not-italic">♡</span>
          </p>
        ) : (
          <>
            <MethodTag method={day.method} />
            <span
              className={`font-display text-base font-semibold text-mocha sm:text-lg ${
                done ? 'line-through decoration-accent/60 decoration-2' : ''
              }`}
            >
              {day.title}
            </span>
          </>
        )}
        {day.program && !rest && (
          <span className="rounded-pill bg-accent/15 px-2 py-0.5 font-body text-[0.55rem] font-bold uppercase tracking-wide text-accent">
            D{day.program.day}
          </span>
        )}
        {day.link && <WatchLink href={day.link} />}
        {!rest && <LogButton day={day} weights={weights} />}
      </div>

      <CheckCircle done={done} onToggle={onToggle} rest={rest} label={day.dayName} />
    </motion.div>
  )
}
