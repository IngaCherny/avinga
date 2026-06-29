import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Tracker } from '../lib/storage'
import type { MethodKey, ScheduledDay } from '../data/types'
import { METHODS, PLAN_SUBTITLE } from '../data/schedule'
import {
  buildDay,
  getMonthMatrix,
  isSameDay,
  monthName,
  parseISO,
  today,
} from '../lib/dates'
import Header from './Header'
import DayBadge from './DayBadge'
import MethodTag from './MethodTag'
import CheckCircle from './CheckCircle'

const WEEK_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

/** Per-month subtitle, calling out the 560 Challenge where relevant. */
function monthSubtitle(year: number, month: number): string {
  if (year === 2026 && month === 6) return 'Lift-first · 560 Challenge starts 20 July'
  if (year === 2026 && month === 7) return 'Lift-first · 560 Challenge, keep building'
  if (year === 2026 && month === 8) return '560 finishes 17 Sept · then back to your plan'
  return PLAN_SUBTITLE
}

/** A single rich, method-tinted calendar cell. */
function MonthCell({
  day,
  inMonth,
  isToday,
  isSelected,
  done,
  onSelect,
}: {
  day: ScheduledDay
  inMonth: boolean
  isToday: boolean
  isSelected: boolean
  done: boolean
  onSelect: () => void
}) {
  const rest = day.method === 'rest'
  const meta = METHODS[day.method]
  const dateNum = parseISO(day.date).getDate()
  const ch = day.challenge
  const isStart = ch?.day === 1
  const isEnd = Boolean(ch?.finale)
  const milestone = isStart || isEnd

  return (
    <button
      onClick={onSelect}
      aria-label={`${day.dayName} ${day.dateLabel}`}
      aria-pressed={isSelected}
      className={`relative flex min-h-[58px] flex-col rounded-2xl p-1.5 text-left transition sm:min-h-[112px] sm:p-2 ${
        meta.tintClass
      } ${inMonth ? '' : 'opacity-40'} ${
        isSelected
          ? 'ring-2 ring-mocha'
          : isToday
            ? 'ring-2 ring-belle'
            : 'ring-1 ring-black/5'
      }`}
    >
      <div className="flex items-start justify-between gap-1">
        <span
          className={
            milestone
              ? 'inline-grid h-5 w-5 place-items-center rounded-full font-display text-[0.7rem] font-bold leading-none text-rose-deep ring-2 ring-rose-deep sm:h-6 sm:w-6 sm:text-sm'
              : 'font-display text-[0.72rem] font-bold leading-none text-mocha sm:text-sm'
          }
        >
          {dateNum}
        </span>
        {ch?.levelUp && <span className="text-[0.6rem] leading-none text-levelup">★</span>}
      </div>

      {/* rich content only where there's room */}
      <div className="mt-1 hidden min-w-0 flex-col gap-0.5 sm:flex">
        {milestone && (
          <span className="truncate font-display text-[0.62rem] font-semibold italic leading-tight text-rose-deep">
            {isStart ? 'we start!' : 'we finished!'}
          </span>
        )}
        <span className="truncate text-[0.5rem] font-bold uppercase tracking-wide text-mocha-soft">
          {meta.label}
        </span>
        <span className="truncate text-[0.72rem] font-semibold leading-tight text-mocha">
          {day.title}
        </span>
        {ch?.swap && (
          <span className="truncate text-[0.55rem] italic leading-tight text-mocha-muted">
            560: {ch.swap}
          </span>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between pt-1">
        {ch ? (
          <span className="text-[0.5rem] font-bold text-mocha-muted sm:text-[0.55rem]">
            d{ch.day}
          </span>
        ) : (
          <span />
        )}
        {!rest &&
          (done ? (
            <span className="grid h-4 w-4 place-items-center rounded-full bg-belle text-[0.6rem] text-white sm:h-5 sm:w-5">
              ✓
            </span>
          ) : (
            <span className="h-4 w-4 rounded-full border-2 border-mocha-muted/30 sm:h-5 sm:w-5" />
          ))}
      </div>
    </button>
  )
}

/** Color-key for the methods. */
function Legend() {
  const items: MethodKey[] = ['belle', 'burn', 'run', 'wildcard', 'runclub', 'rest']
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5">
      {items.map((m) => (
        <span key={m} className="flex items-center gap-1.5">
          <span className={`h-2.5 w-2.5 rounded-full ${METHODS[m].pillClass}`} />
          <span className="font-body text-[0.65rem] font-semibold text-mocha-soft">
            {METHODS[m].label}
          </span>
        </span>
      ))}
    </div>
  )
}

export default function MonthlyView({ tracker }: { tracker: Tracker }) {
  const now = today()
  const [cursor, setCursor] = useState(() => ({ year: now.getFullYear(), month: now.getMonth() }))
  const [selected, setSelected] = useState<string>(() => buildDay(now).date)

  const matrix = useMemo(() => getMonthMatrix(cursor.year, cursor.month), [cursor])
  const selectedDay = buildDay(parseISO(selected))
  const selCh = selectedDay.challenge

  const inMonthTraining = matrix
    .flat()
    .filter((c) => c.inMonth && c.day.method !== 'rest')
    .map((c) => c.day.date)
  const doneCount = tracker.countDone(inMonthTraining)

  const step = (delta: number) => {
    const m = cursor.month + delta
    const year = cursor.year + Math.floor(m / 12)
    const month = ((m % 12) + 12) % 12
    setCursor({ year, month })
    // Keep the detail card in sync: select today if it's in the new month,
    // otherwise the 1st, so we never show a day from a different month.
    const target =
      year === now.getFullYear() && month === now.getMonth() ? now : new Date(year, month, 1)
    setSelected(buildDay(target).date)
  }

  return (
    <div className="space-y-6">
      <Header
        titleLead={monthName(cursor.month)}
        titleAccent={String(cursor.year)}
        tagline={`${monthName(cursor.month).toLowerCase()}, lift first, busy girl`}
        subtitle={monthSubtitle(cursor.year, cursor.month)}
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

      <div className="text-center font-body text-xs font-semibold uppercase tracking-[0.1em] text-mocha-muted">
        {doneCount} / {inMonthTraining.length} done this month
      </div>

      {/* calendar */}
      <div className="rounded-card bg-cream-card/70 p-2 shadow-card sm:p-4">
        <div className="mb-1.5 grid grid-cols-7 gap-1 sm:gap-1.5">
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
          className="grid grid-cols-7 gap-1 sm:gap-1.5"
        >
          {matrix.flat().map(({ day, inMonth }) => (
            <MonthCell
              key={day.date}
              day={day}
              inMonth={inMonth}
              isToday={isSameDay(parseISO(day.date), now)}
              isSelected={day.date === selected}
              done={tracker.isDone(day.date)}
              onSelect={() => setSelected(day.date)}
            />
          ))}
        </motion.div>
      </div>

      <Legend />

      {/* selected day detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDay.date}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className={`flex items-start gap-4 rounded-card px-5 py-5 ${
            selectedDay.method === 'rest' ? 'bg-cream-deep/80' : 'bg-cream-card shadow-card'
          }`}
        >
          <DayBadge weekday={selectedDay.weekday} label={selectedDay.dayShort} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="font-body text-[0.65rem] font-bold uppercase tracking-[0.14em] text-mocha-muted">
              {selectedDay.dayName} · {selectedDay.dateLabel}
            </p>

            {selectedDay.method === 'rest' ? (
              <p className="mt-1 font-display text-lg italic text-mocha-muted">rest &amp; restore ♡</p>
            ) : (
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <MethodTag method={selectedDay.method} />
                <span className="font-display text-lg font-semibold text-mocha">
                  {selectedDay.title}
                </span>
              </div>
            )}

            {/* 560 challenge details */}
            {selCh && (
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <span className="rounded-pill bg-wildcard/15 px-2.5 py-1 font-body text-[0.62rem] font-bold uppercase tracking-wide text-wildcard">
                  {selCh.finale ? '560 · Final Day' : `560 · Day ${selCh.day}`}
                </span>
                {selCh.day === 1 && (
                  <span className="rounded-pill bg-rose-deep/15 px-2.5 py-1 font-body text-[0.62rem] font-bold uppercase tracking-wide text-rose-deep">
                    Challenge begins
                  </span>
                )}
                {selCh.finale && (
                  <span className="rounded-pill bg-rose-deep/15 px-2.5 py-1 font-body text-[0.62rem] font-bold uppercase tracking-wide text-rose-deep">
                    Challenge complete
                  </span>
                )}
                {selCh.levelUp && (
                  <span className="rounded-pill bg-levelup/15 px-2.5 py-1 font-body text-[0.62rem] font-bold uppercase tracking-wide text-levelup">
                    ★ Level-Up
                  </span>
                )}
                {selCh.swap && (
                  <span className="font-body text-[0.72rem] italic text-mocha-muted">
                    Travelling? swap in <strong className="not-italic font-semibold">560: {selCh.swap}</strong>
                  </span>
                )}
              </div>
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

      <p className="px-2 text-center font-body text-[0.68rem] italic leading-relaxed text-mocha-muted">
        ★ Level-Up days benchmark your progress · faint “560:” = the original 560 workout to swap in
        when you’re travelling without weights.
      </p>
    </div>
  )
}
