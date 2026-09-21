import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { ScheduledDay } from '../data/types'
import type { Weights, WorkoutSet } from '../lib/weights'
import { DEFAULT_REPS, DEFAULT_SETS, suggestedFor } from '../data/exercises'
import { dateLabel, parseISO } from '../lib/dates'

interface Props {
  day: ScheduledDay
  weights: Weights
  onClose: () => void
}

/** "5 · 5 · 3" */
function setsLabel(sets: WorkoutSet[]): string {
  return sets.map((s) => s.weight).join(' · ')
}

/** Modal to log the sets (weight × reps) you lifted on a given day. */
export default function WeightLogger({ day, weights, onClose }: Props) {
  // The exercises to show: the day's official list plus anything already logged.
  const names = useMemo(() => {
    const logged = weights.loggedExercises(day.date)
    return Array.from(new Set([...suggestedFor(day.title), ...logged]))
  }, [day.date, day.title, weights])

  const [draft, setDraft] = useState<Record<string, WorkoutSet[]>>(() => {
    const d: Record<string, WorkoutSet[]> = {}
    for (const n of names) d[n] = weights.setsFor(day.date, n)
    return d
  })
  const [extra, setExtra] = useState<string[]>([])
  const [custom, setCustom] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [saved, setSaved] = useState(false)

  const u = weights.unit
  const chips = useMemo(() => weights.commonWeights(), [weights])
  const all = useMemo(() => [...names, ...extra], [names, extra])

  // "Mine" = exercises you've done before for this workout, or already logged today.
  const mine = useMemo(
    () => all.filter((ex) => (draft[ex]?.length ?? 0) > 0 || weights.lastSessionFor(ex, day.date)),
    [all, draft, weights, day.date],
  )
  const visible = showAll || mine.length === 0 ? all : mine

  const touch = () => setSaved(false)

  function setSets(ex: string, sets: WorkoutSet[]) {
    setDraft((prev) => ({ ...prev, [ex]: sets }))
    touch()
  }

  /** Tap a weight chip: fill every set with it, creating the program's 3 if empty. */
  function pickWeight(ex: string, weight: number) {
    const sets = draft[ex] ?? []
    if (sets.length === 0) {
      setSets(ex, Array.from({ length: DEFAULT_SETS }, () => ({ weight, reps: DEFAULT_REPS })))
    } else {
      setSets(ex, sets.map((s) => ({ ...s, weight })))
    }
  }

  /** Copy last session's sets straight in. */
  function repeatLast(ex: string) {
    const last = weights.lastSessionFor(ex, day.date)
    if (last) setSets(ex, last.sets.map((s) => ({ ...s })))
  }

  function addSet(ex: string) {
    const sets = draft[ex] ?? []
    const prev = sets[sets.length - 1]
    setSets(ex, [...sets, { weight: prev?.weight ?? 0, reps: prev?.reps ?? DEFAULT_REPS }])
  }

  function bump(ex: string, i: number, delta: number) {
    const sets = [...(draft[ex] ?? [])]
    const next = Math.max(0, Math.round((sets[i].weight + delta) * 10) / 10)
    sets[i] = { ...sets[i], weight: next }
    setSets(ex, sets)
  }

  function addCustom() {
    const name = custom.trim()
    if (!name || all.includes(name)) return setCustom('')
    setExtra((x) => [...x, name])
    setDraft((prev) => ({ ...prev, [name]: [{ weight: 0, reps: DEFAULT_REPS }] }))
    setCustom('')
    setShowAll(true)
    touch()
  }

  function save() {
    for (const n of all) weights.saveSets(day.date, n, draft[n] ?? [])
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
        className="flex max-h-[88vh] w-full max-w-md flex-col rounded-card bg-cream-card shadow-card"
      >
        {/* header */}
        <div className="flex items-start justify-between gap-3 border-b border-cream-deep p-5 pb-4">
          <div className="min-w-0">
            <h2 className="font-display text-xl font-bold text-mocha">Log lifts</h2>
            <p className="truncate font-body text-xs font-semibold uppercase tracking-wide text-mocha-muted">
              {day.dayName} · {day.dateLabel} · {day.title}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
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

        {/* exercises */}
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-5">
          {visible.map((ex) => {
            const sets = draft[ex] ?? []
            const last = weights.lastSessionFor(ex, day.date)
            return (
              <div key={ex} className="rounded-2xl bg-cream/70 p-3">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-display text-sm font-semibold text-mocha">{ex}</p>
                  {last && (
                    <span className="shrink-0 font-body text-[0.62rem] text-mocha-muted">
                      last {setsLabel(last.sets)}{u} · {dateLabel(parseISO(last.date))}
                    </span>
                  )}
                </div>

                {/* one-tap weights */}
                <div className="mt-2 flex flex-wrap items-center gap-1">
                  {last && (
                    <button
                      onClick={() => repeatLast(ex)}
                      className="rounded-pill bg-mocha px-2.5 py-1 font-body text-[0.68rem] font-bold text-cream shadow-pill"
                    >
                      ↺ repeat
                    </button>
                  )}
                  {chips.map((w) => (
                    <button
                      key={w}
                      onClick={() => pickWeight(ex, w)}
                      className="rounded-pill bg-cream-card px-2.5 py-1 font-body text-[0.68rem] font-bold text-mocha-soft shadow-soft transition-transform active:scale-95"
                    >
                      {w}
                    </button>
                  ))}
                </div>

                {/* set rows */}
                {sets.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {sets.map((s, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <span className="w-4 text-center font-body text-xs font-bold text-mocha-muted">
                          {i + 1}
                        </span>
                        <button
                          onClick={() => bump(ex, i, -1)}
                          aria-label="Less weight"
                          className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-cream-card font-bold text-mocha-soft shadow-soft"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          inputMode="decimal"
                          value={s.weight || ''}
                          onChange={(e) => {
                            const next = [...sets]
                            next[i] = { ...next[i], weight: Number(e.target.value) }
                            setSets(ex, next)
                          }}
                          placeholder="0"
                          aria-label={`${ex} set ${i + 1} weight`}
                          className="w-14 rounded-lg border border-cream-deep bg-cream-card px-1 py-1.5 text-center font-body text-sm font-bold text-mocha outline-none focus:border-accent"
                        />
                        <button
                          onClick={() => bump(ex, i, 1)}
                          aria-label="More weight"
                          className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-cream-card font-bold text-mocha-soft shadow-soft"
                        >
                          +
                        </button>
                        <span className="font-body text-[0.68rem] text-mocha-muted">{u} ×</span>
                        <input
                          type="number"
                          inputMode="numeric"
                          value={s.reps || ''}
                          onChange={(e) => {
                            const next = [...sets]
                            next[i] = { ...next[i], reps: Number(e.target.value) }
                            setSets(ex, next)
                          }}
                          placeholder="0"
                          aria-label={`${ex} set ${i + 1} reps`}
                          className="w-11 rounded-lg border border-cream-deep bg-cream-card px-1 py-1.5 text-center font-body text-sm text-mocha outline-none focus:border-accent"
                        />
                        <button
                          onClick={() => setSets(ex, sets.filter((_, k) => k !== i))}
                          aria-label="Remove set"
                          className="ml-auto grid h-6 w-6 place-items-center rounded-full text-mocha-muted"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addSet(ex)}
                      className="rounded-pill px-1 py-0.5 font-body text-[0.68rem] font-bold text-accent"
                    >
                      + add set
                    </button>
                  </div>
                )}
              </div>
            )
          })}

          {/* show the rest of the official list */}
          {mine.length > 0 && !showAll && all.length > mine.length && (
            <button
              onClick={() => setShowAll(true)}
              className="w-full rounded-pill bg-cream px-4 py-2 font-body text-xs font-bold text-mocha-soft shadow-soft"
            >
              Show all {all.length} exercises
            </button>
          )}

          <div className="flex items-center gap-2 pt-1">
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
        </div>

        {/* save */}
        <div className="border-t border-cream-deep p-5 pt-4">
          <button
            onClick={save}
            className="w-full rounded-pill bg-mocha px-5 py-3 font-body text-sm font-bold uppercase tracking-[0.12em] text-cream shadow-pill transition-transform active:scale-95"
          >
            {saved ? 'Saved ✓' : 'Save'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
