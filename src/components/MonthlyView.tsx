import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Tracker } from '../lib/storage'
import type { ScheduledDay } from '../data/types'
import { METHODS } from '../data/schedule'
import { buildDay, getMonthMatrix, isSameDay, monthLongLabel, parseISO, today } from '../lib/dates'
import Header from './Header'
import DayBadge from './DayBadge'
import MethodTag from './MethodTag'
import CheckCircle from './CheckCircle'

const WEEK_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

/** Small colored dot showing the method for a calendar cell. */
function MethodDot({ method }: { method: ScheduledDay['method'] }) {
  if (method === 'rest') {
    return <span className="h-1.5 w-1.5 rounded-full bg-mocha-muted/30" />
  }
  return <span className={`h-2 w-2 rounded-full ${METHODS[method].pillClass}`} />
}

export default function MonthlyView({ tracker }: { tracker: Tracker }) {
  const now = today()
  const [cursor, setCursor] = useState(() => ({ year: now.getFullYear(), month: now.getMonth() }))
  const [selected, setSelected] = useState<string>(() => buildDay(now).date)

  const matrix = useMemo(() => getMonthMatrix(cursor.year, cursor.month), [cursor])
  const selectedDay = buildDay(parseISO(selected))

  // Month-wide progress (training days only, in-month cells).
  const inMonthTraining = matrix
    .flat()
    .filter((c) => c.inMonth && c.day.method !== 'rest')
    .map((c) => c.day.date)
  const doneCount = tracker.countDone(inMonthTraining)

  const step = (delta: number) => {
    setCursor((c) => {
      const m = c.month + delta
      const year = c.year + Math.floor(m / 12)
      const month = ((m % 12) + 12) % 12
      return { year, month }
    })
  }

  return (
    <div className="space-y-6">
      <Header
        titleLead="Monthly"
        titleAccent="Routine"
        tagline="your month of movement"
        pill={monthLongLabel(cursor.year, cursor.month)}
        subtitle={`${doneCount} of ${inMonthTraining.length} workouts done this month`}
      />

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => step(-1)}
          aria-label="Previous month"
          className="grid h-9 w-9 place-items-center rounded-full bg-cream-card text-mocha shadow-soft transition-transform hover:scale-105 active:scale-95"
        >
          ‹
        </button>
        <button
          onClick={() => {
            setCursor({ year: now.getFullYear(), month: now.getMonth() })
            setSelected(buildDay(now).date)
          }}
          className="rounded-pill bg-cream-card px-4 py-1.5 font-body text-xs font-bold text-mocha-soft shadow-soft"
        >
          Today
        </button>
        <button
          onClick={() => step(1)}
          aria-label="Next month"
          className="grid h-9 w-9 place-items-center rounded-full bg-cream-card text-mocha shadow-soft transition-transform hover:scale-105 active:scale-95"
        >
          ›
        </button>
      </div>

      {/* calendar */}
      <div className="rounded-card bg-cream-card p-3 shadow-card sm:p-5">
        <div className="mb-2 grid grid-cols-7 gap-1.5">
          {WEEK_LABELS.map((d, i) => (
            <div
              key={i}
              className="text-center font-body text-[0.65rem] font-bold uppercase tracking-wide text-mocha-muted"
            >
              {d}
            </div>
          ))}
        </div>

        <motion.div
          key={`${cursor.year}-${cursor.month}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-7 gap-1.5"
        >
          {matrix.flat().map(({ day, inMonth }) => {
            const isToday = isSameDay(parseISO(day.date), now)
            const isSelected = day.date === selected
            const done = tracker.isDone(day.date)
            const rest = day.method === 'rest'
            return (
              <button
                key={day.date}
                onClick={() => setSelected(day.date)}
                aria-label={`${day.dayName} ${day.dateLabel}`}
                aria-pressed={isSelected}
                className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl text-sm transition-colors ${
                  inMonth ? '' : 'opacity-35'
                } ${
                  isSelected
                    ? 'bg-mocha text-cream'
                    : isToday
                      ? 'bg-belle/20 ring-1 ring-belle/60'
                      : 'hover:bg-cream-deep/70'
                } ${done && !isSelected ? 'bg-belle/10' : ''}`}
              >
                <span
                  className={`font-display font-semibold ${
                    isSelected ? 'text-cream' : 'text-mocha'
                  }`}
                >
                  {parseISO(day.date).getDate()}
                </span>
                {done && !rest ? (
                  <span className={`text-[0.6rem] leading-none ${isSelected ? 'text-cream' : 'text-belle'}`}>
                    ✓
                  </span>
                ) : (
                  <MethodDot method={day.method} />
                )}
              </button>
            )
          })}
        </motion.div>
      </div>

      {/* selected day detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDay.date}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className={`flex items-center gap-4 rounded-card px-5 py-5 ${
            selectedDay.method === 'rest' ? 'bg-cream-deep/80' : 'bg-cream-card shadow-card'
          }`}
        >
          <DayBadge weekday={selectedDay.weekday} label={selectedDay.dayShort} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="font-body text-[0.65rem] font-bold uppercase tracking-[0.14em] text-mocha-muted">
              {selectedDay.dayName} · {selectedDay.dateLabel}
            </p>
            {selectedDay.method === 'rest' ? (
              <p className="mt-1 font-display text-lg italic text-mocha-muted">
                rest &amp; restore ♡
              </p>
            ) : (
              <>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <MethodTag method={selectedDay.method} />
                  <span className="font-display text-lg font-semibold text-mocha">
                    {selectedDay.title}
                  </span>
                </div>
                {selectedDay.note && (
                  <p className="mt-1.5 font-body text-sm text-mocha-soft">{selectedDay.note}</p>
                )}
              </>
            )}
          </div>
          {selectedDay.method !== 'rest' && (
            <CheckCircle
              done={tracker.isDone(selectedDay.date)}
              onToggle={() => tracker.toggle(selectedDay.date)}
              label={selectedDay.dayName}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
