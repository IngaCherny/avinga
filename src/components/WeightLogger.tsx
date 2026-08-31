import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { ScheduledDay } from '../data/types'
import type { Weights, WorkoutSet } from '../lib/weights'
import { suggestedFor } from '../data/exercises'

interface Props {
  day: ScheduledDay
  weights: Weights
  onClose: () => void
}

/** Modal to log the sets (weight × reps) you lifted on a given day. */
export default function WeightLogger({ day, weights, onClose }: Props) {
  // The exercises to show: the day's suggestions plus anything already logged.
  const initialNames = useMemo(() => {
    const logged = weights.loggedExercises(day.date)
    const suggested = suggestedFor(day.title)
    return Array.from(new Set([...suggested, ...logged]))
  }, [day.date, day.title, weights])

  const [names, setNames] = useState<string[]>(initialNames)
  const [draft, setDraft] = useState<Record<string, WorkoutSet[]>>(() => {
    const d: Record<string, WorkoutSet[]> = {}
    for (const n of initialNames) d[n] = weights.setsFor(day.date, n)
    return d
  })
  const [custom, setCustom] = useState('')
  const [saved, setSaved] = useState(false)

  const u = weights.unit

  function updateSet(ex: string, i: number, patch: Partial<WorkoutSet>) {
    setDraft((prev) => {
      const sets = [...(prev[ex] ?? [])]
      sets[i] = { ...sets[i], ...patch }
      return { ...prev, [ex]: sets }
    })
    setSaved(false)
  }

  function addSet(ex: string) {
    setDraft((prev) => {
      const sets = [...(prev[ex] ?? [])]
      // Default a new set from the previous one, or 12 reps to start.
      const last = sets[sets.length - 1]
      sets.push({ weight: last?.weight ?? 0, reps: last?.reps ?? 12 })
      return { ...prev, [ex]: sets }
    })
    setSaved(false)
  }

  function removeSet(ex: string, i: number) {
    setDraft((prev) => {
      const sets = [...(prev[ex] ?? [])]
      sets.splice(i, 1)
      return { ...prev, [ex]: sets }
    })
    setSaved(false)
  }

  function addCustom() {
    const name = custom.trim()
    if (!name || names.includes(name)) {
      setCustom('')
      return
    }
    setNames((n) => [...n, name])
    setDraft((prev) => ({ ...prev, [name]: [{ weight: 0, reps: 12 }] }))
    setCustom('')
    setSaved(false)
  }

  function save() {
    for (const n of names) weights.saveSets(day.date, n, draft[n] ?? [])
    setSaved(true)
    window.setTimeout(onClose, 500)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-mocha/30 px-3 py-6 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[88vh] w-full max-w-md overflow-y-auto rounded-card bg-cream-card p-6 shadow-card"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-bold text-mocha">Log lifts</h2>
            <p className="font-body text-xs font-semibold uppercase tracking-wide text-mocha-muted">
              {day.dayName} · {day.dateLabel} · {day.title}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* unit toggle */}
            <div className="flex overflow-hidden rounded-pill bg-cream text-xs font-bold shadow-soft">
              {(['lb', 'kg'] as const).map((unit) => (
                <button
                  key={unit}
                  onClick={() => weights.setUnit(unit)}
                  className={`px-2.5 py-1 ${u === unit ? 'bg-accent text-white' : 'text-mocha-muted'}`}
                >
                  {unit}
                </button>
              ))}
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="grid h-8 w-8 place-items-center rounded-full bg-cream text-mocha-soft shadow-soft"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {names.map((ex) => {
            const sets = draft[ex] ?? []
            return (
              <div key={ex} className="rounded-2xl bg-cream/70 p-3">
                <p className="font-display text-sm font-semibold text-mocha">{ex}</p>
                <div className="mt-2 space-y-1.5">
                  {sets.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-5 text-center font-body text-xs font-bold text-mocha-muted">
                        {i + 1}
                      </span>
                      <input
                        type="number"
                        inputMode="decimal"
                        value={s.weight || ''}
                        onChange={(e) => updateSet(ex, i, { weight: Number(e.target.value) })}
                        placeholder="0"
                        aria-label={`${ex} set ${i + 1} weight`}
                        className="w-16 rounded-lg border border-cream-deep bg-cream-card px-2 py-1.5 text-center font-body text-sm text-mocha outline-none focus:border-accent"
                      />
                      <span className="font-body text-xs text-mocha-muted">{u}</span>
                      <span className="font-body text-xs text-mocha-muted">×</span>
                      <input
                        type="number"
                        inputMode="numeric"
                        value={s.reps || ''}
                        onChange={(e) => updateSet(ex, i, { reps: Number(e.target.value) })}
                        placeholder="0"
                        aria-label={`${ex} set ${i + 1} reps`}
                        className="w-14 rounded-lg border border-cream-deep bg-cream-card px-2 py-1.5 text-center font-body text-sm text-mocha outline-none focus:border-accent"
                      />
                      <span className="font-body text-xs text-mocha-muted">reps</span>
                      <button
                        onClick={() => removeSet(ex, i)}
                        aria-label="Remove set"
                        className="ml-auto grid h-6 w-6 place-items-center rounded-full text-mocha-muted hover:bg-cream-deep"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => addSet(ex)}
                  className="mt-2 rounded-pill bg-cream-card px-3 py-1 font-body text-xs font-bold text-accent shadow-soft"
                >
                  + add set
                </button>
              </div>
            )
          })}
          {names.length === 0 && (
            <p className="font-body text-sm italic text-mocha-muted">
              No exercises yet — add one below.
            </p>
          )}
        </div>

        {/* add a custom exercise */}
        <div className="mt-3 flex items-center gap-2">
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustom()}
            placeholder="add another exercise…"
            className="min-w-0 flex-1 rounded-pill border border-cream-deep bg-cream px-4 py-2 font-body text-sm text-mocha outline-none focus:border-accent"
          />
          <button
            onClick={addCustom}
            className="rounded-pill bg-cream px-3 py-2 font-body text-sm font-bold text-mocha shadow-soft"
          >
            + add
          </button>
        </div>

        <button
          onClick={save}
          className="mt-5 w-full rounded-pill bg-mocha px-5 py-3 font-body text-sm font-bold uppercase tracking-[0.12em] text-cream shadow-pill transition-transform active:scale-95"
        >
          {saved ? 'Saved ✓' : 'Save'}
        </button>
      </motion.div>
    </div>
  )
}
