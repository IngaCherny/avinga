import { motion } from 'framer-motion'
import type { Tracker } from '../lib/storage'
import { addDays, buildDay, startOfWeek, toISO, today } from '../lib/dates'
import { personById } from '../data/people'
import DayBadge from './DayBadge'
import MethodTag from './MethodTag'
import CheckCircle from './CheckCircle'
import Header from './Header'
import QuoteCard from './QuoteCard'
import NutritionCard from './NutritionCard'
import StatsCard from './StatsCard'
import { challengeForWeek } from '../data/schedule'
import ChallengeBanner from './ChallengeBanner'
import WatchLink from './WatchLink'
import { DONE_CHEERS, pickByDate } from '../data/quotes'
import type { ScheduledDay } from '../data/types'

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'good morning'
  if (h < 17) return 'good afternoon'
  return 'good evening'
}

/** Hero card for "right now". */
function HeroCard({
  day,
  tracker,
}: {
  day: ScheduledDay
  tracker: Tracker
}) {
  const rest = day.method === 'rest'
  const done = tracker.isDone(day.date)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 160, damping: 18 }}
      className={`relative overflow-hidden rounded-card p-6 sm:p-8 ${
        rest ? 'bg-cream-deep' : 'bg-cream-card'
      } shadow-card`}
    >
      <span className="font-body text-xs font-bold uppercase tracking-[0.18em] text-belle">
        Today · {day.dateLabel}
      </span>

      <div className="mt-4 flex items-center gap-4">
        <DayBadge weekday={day.weekday} label={day.dayShort} size="lg" />
        <div className="min-w-0">
          <h2 className="font-display text-3xl font-bold leading-tight text-mocha sm:text-4xl">
            {day.dayName}
          </h2>
          {rest ? (
            <p className="mt-1 font-display text-lg italic text-mocha-muted">
              rest &amp; restore ♡
            </p>
          ) : (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <MethodTag method={day.method} />
              <span className="font-display text-xl font-semibold text-mocha">
                {day.title}
              </span>
            </div>
          )}
        </div>
      </div>

      {day.challenge && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-pill bg-wildcard/15 px-3 py-1 font-body text-[0.65rem] font-bold uppercase tracking-wide text-wildcard">
            {day.challenge.finale ? '560 · Final Day' : `560 Challenge · Day ${day.challenge.day} of 60`}
          </span>
          {day.challenge.levelUp && (
            <span className="rounded-pill bg-levelup/15 px-3 py-1 font-body text-[0.65rem] font-bold uppercase tracking-wide text-levelup">
              ★ Level-Up
            </span>
          )}
        </div>
      )}

      {!rest && day.note && (
        <p className="mt-4 font-body text-sm text-mocha-soft">{day.note}</p>
      )}

      {day.link && (
        <div className="mt-4">
          <WatchLink href={day.link} size="md" />
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl bg-cream/70 px-4 py-3">
        <span className="font-body text-sm font-semibold text-mocha-soft">
          {done
            ? pickByDate(DONE_CHEERS, day.date)
            : rest
              ? 'Tap when you’ve rested'
              : 'Tap when you finish'}
        </span>
        <CheckCircle
          done={done}
          onToggle={() => tracker.toggle(day.date)}
          rest={rest}
          label="today"
        />
      </div>
    </motion.div>
  )
}

/** Compact look-ahead / look-back card. */
function MiniCard({
  day,
  label,
  tracker,
}: {
  day: ScheduledDay
  label: string
  tracker: Tracker
}) {
  const rest = day.method === 'rest'
  const done = tracker.isDone(day.date)
  return (
    <div className="flex items-center gap-3 rounded-card bg-cream-card/80 px-4 py-3.5 shadow-soft">
      <DayBadge weekday={day.weekday} label={day.dayShort} />
      <div className="min-w-0 flex-1">
        <p className="font-body text-[0.62rem] font-bold uppercase tracking-[0.14em] text-mocha-muted">
          {label} · {day.dateLabel}
        </p>
        {rest ? (
          <p className="font-display text-sm italic text-mocha-muted">rest &amp; restore ♡</p>
        ) : (
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
            <MethodTag method={day.method} />
            <span className="font-display text-sm font-semibold text-mocha">{day.title}</span>
            {day.link && <WatchLink href={day.link} />}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => tracker.toggle(day.date)}
        aria-pressed={done}
        aria-label={done ? `Mark ${label} not done` : `Mark ${label} done`}
        className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs transition-colors ${
          done
            ? 'bg-belle text-white'
            : `border-2 ${rest ? 'border-dashed' : ''} border-mocha-muted/30`
        }`}
      >
        {done ? '✓' : ''}
      </button>
    </div>
  )
}

export default function TodayView({ tracker }: { tracker: Tracker }) {
  const now = today()
  const todayDay = buildDay(now)
  const tomorrowDay = buildDay(addDays(now, 1))
  const yesterdayDay = buildDay(addDays(now, -1))

  const person = personById(tracker.activePerson)
  const challenge = challengeForWeek(toISO(startOfWeek(now)))

  return (
    <div className="space-y-6">
      <Header
        titleLead="Hey"
        titleAccent={person.name}
        tagline={`${greeting()}, busy girl`}
        subtitle="here's your day, move, sweat, repeat"
      />
      <StatsCard tracker={tracker} />
      <ChallengeBanner tracker={tracker} />
      {challenge && <NutritionCard challenge={challenge} />}
      <QuoteCard isoDate={todayDay.date} />
      {/* Chronological: yesterday → today → tomorrow */}
      <div className="space-y-3">
        <MiniCard day={yesterdayDay} label="Yesterday" tracker={tracker} />
        <HeroCard day={todayDay} tracker={tracker} />
        <MiniCard day={tomorrowDay} label="Tomorrow" tracker={tracker} />
      </div>
    </div>
  )
}
