import { useState } from 'react'
import { motion } from 'framer-motion'
import type { SessionPoint, Weights } from '../lib/weights'
import { parseISO, dateLabel, buildDay } from '../lib/dates'
import Header from './Header'

/** A tiny inline line chart of top weight across sessions. */
function Sparkline({ points }: { points: SessionPoint[] }) {
  const w = 220
  const h = 44
  const pad = 4
  const vals = points.map((p) => p.top)
  const max = Math.max(...vals)
  const min = Math.min(...vals)
  const span = max - min || 1

  const xy = points.map((p, i) => {
    const x = points.length === 1 ? w / 2 : pad + (i / (points.length - 1)) * (w - pad * 2)
    const y = h - pad - ((p.top - min) / span) * (h - pad * 2)
    return { x, y }
  })
  const d = xy.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-11 w-full" preserveAspectRatio="none" aria-hidden>
      {points.length > 1 && (
        <path d={d} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      )}
      {xy.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={2.5} fill="currentColor" />
      ))}
    </svg>
  )
}

function trendArrow(points: SessionPoint[]): { symbol: string; className: string } {
  if (points.length < 2) return { symbol: '•', className: 'text-mocha-muted' }
  const diff = points[points.length - 1].top - points[0].top
  if (diff > 0) return { symbol: '↑', className: 'text-back' }
  if (diff < 0) return { symbol: '↓', className: 'text-chest' }
  return { symbol: '→', className: 'text-mocha-muted' }
}

function ExerciseCard({
  exercise,
  points,
  unit,
}: {
  exercise: string
  points: SessionPoint[]
  unit: string
}) {
  const [open, setOpen] = useState(false)
  const best = Math.max(...points.map((p) => p.top))
  const latest = points[points.length - 1]
  const trend = trendArrow(points)

  return (
    <div className="rounded-card bg-cream-card p-5 shadow-soft">
      <button onClick={() => setOpen((o) => !o)} className="w-full text-left">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-display text-base font-semibold text-mocha">{exercise}</span>
          <span className={`font-display text-sm font-bold ${trend.className}`}>{trend.symbol}</span>
        </div>
        <div className="mt-1 flex items-baseline gap-3 font-body text-xs text-mocha-muted">
          <span>
            latest <strong className="font-bold text-mocha">{latest.top}{unit}</strong>
          </span>
          <span>
            best <strong className="font-bold text-mocha">{best}{unit}</strong>
          </span>
          <span>{points.length} session{points.length === 1 ? '' : 's'}</span>
        </div>
        <div className="mt-2 text-accent">
          <Sparkline points={points} />
        </div>
      </button>

      {open && (
        <div className="mt-3 space-y-1 border-t border-cream-deep pt-3">
          {[...points].reverse().map((p) => (
            <div key={p.date} className="flex items-center justify-between font-body text-xs">
              <span className="text-mocha-soft">
                {dateLabel(parseISO(p.date))}
                {(() => {
                  const wk = buildDay(parseISO(p.date)).program?.week
                  return wk ? <span className="ml-1.5 text-mocha-muted">· W{wk}</span> : null
                })()}
              </span>
              <span className="text-mocha-muted">
                top <strong className="font-bold text-mocha">{p.top}{unit}</strong> · {p.sets} set
                {p.sets === 1 ? '' : 's'} · vol {p.volume}{unit}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProgressView({ weights }: { weights: Weights }) {
  const exercises = weights.allExercises()

  return (
    <div className="space-y-6">
      <Header
        titleLead="Your"
        titleAccent="Progress"
        tagline="watch the numbers climb"
        subtitle="weights you've logged, over time"
      />

      {exercises.length === 0 ? (
        <div className="rounded-card bg-cream-card p-8 text-center shadow-soft">
          <span aria-hidden className="text-4xl">🏋️</span>
          <p className="mt-3 font-display text-lg font-semibold text-mocha">No lifts logged yet</p>
          <p className="mx-auto mt-2 max-w-xs font-body text-sm text-mocha-soft">
            Tap <strong className="text-accent">Log lifts</strong> on any workout (Today or Weekly)
            to record your weights. Your progress for each exercise shows up here.
          </p>
        </div>
      ) : (
        <motion.div
          variants={{ show: { transition: { staggerChildren: 0.05 } } }}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {exercises.map((ex) => (
            <motion.div key={ex} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
              <ExerciseCard exercise={ex} points={weights.historyFor(ex)} unit={weights.unit} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
