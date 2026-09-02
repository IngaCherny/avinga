import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { Tracker } from '../lib/storage'
import type { Weights } from '../lib/weights'
import type { WeekStart } from '../lib/region'
import WeekShapeToggle from './WeekShapeToggle'
import { addDays, getWeek, isSameDay, parseISO, today, weekRangeLabel } from '../lib/dates'
import { PLAN_SUBTITLE } from '../data/schedule'
import WorkoutCard from './WorkoutCard'
import ProgressRing from './ProgressRing'
import Header from './Header'

function NavButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-full bg-cream-card text-mocha shadow-soft transition-transform hover:scale-105 active:scale-95"
    >
      {children}
    </button>
  )
}

export default function WeeklyView({
  tracker,
  weights,
  weekStart,
  onWeekStartChange,
}: {
  tracker: Tracker
  weights: Weights
  weekStart: WeekStart
  onWeekStartChange: (w: WeekStart) => void
}) {
  const [weekRef, setWeekRef] = useState(() => today())
  const now = today()

  const week = useMemo(() => getWeek(weekRef), [weekRef, weekStart])
  const rangeLabel = weekRangeLabel(week)
  const trainingDays = week.filter((d) => d.method !== 'rest')
  const doneCount = tracker.countDone(trainingDays.map((d) => d.date))
  const isCurrentWeek = week.some((d) => isSameDay(parseISO(d.date), now))

  return (
    <div className="space-y-6">
      <Header
        titleLead="Weekly"
        titleAccent="LIIFT"
        tagline="your lift week, let’s go"
        pill={rangeLabel}
        subtitle={PLAN_SUBTITLE}
      />

      <WeekShapeToggle value={weekStart} onChange={onWeekStartChange} />

      {/* week nav + progress */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <NavButton onClick={() => setWeekRef((r) => addDays(r, -7))} label="Previous week">
            ‹
          </NavButton>
          <NavButton onClick={() => setWeekRef((r) => addDays(r, 7))} label="Next week">
            ›
          </NavButton>
          {!isCurrentWeek && (
            <button
              onClick={() => setWeekRef(today())}
              className="rounded-pill bg-cream-card px-3 py-1.5 font-body text-xs font-bold text-mocha-soft shadow-soft"
            >
              This week
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden font-body text-xs font-semibold uppercase tracking-[0.1em] text-mocha-muted sm:inline">
            this week
          </span>
          <ProgressRing done={doneCount} total={trainingDays.length} />
        </div>
      </div>

      <motion.div
        key={week[0]?.date}
        variants={{ show: { transition: { staggerChildren: 0.05 } } }}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        {week.map((day) => (
          <WorkoutCard
            key={day.date}
            day={day}
            done={tracker.isDone(day.date)}
            onToggle={() => tracker.toggle(day.date)}
            isToday={isSameDay(parseISO(day.date), now)}
            weights={weights}
          />
        ))}
      </motion.div>
    </div>
  )
}
