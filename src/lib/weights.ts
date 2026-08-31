import { useCallback, useEffect, useState } from 'react'

/**
 * On-device weight log. Records the sets you lifted per day and exercise, so you
 * can see your numbers climb over time. Stored only in this browser's
 * localStorage — nothing is uploaded.
 */
const STORAGE_KEY = 'liift-more:weights:v1'
const UNIT_KEY = 'liift-more:unit:v1'

export type Unit = 'lb' | 'kg'

/** One logged set. */
export interface WorkoutSet {
  weight: number
  reps: number
}

/** date (YYYY-MM-DD) → exercise name → the sets you did. */
type WeightLog = Record<string, Record<string, WorkoutSet[]>>

/** A single session's summary for one exercise, used by the progress view. */
export interface SessionPoint {
  date: string
  /** Heaviest set that day. */
  top: number
  /** Total volume that day (Σ weight × reps). */
  volume: number
  /** Number of sets logged. */
  sets: number
}

function loadLog(): WeightLog {
  if (typeof localStorage === 'undefined') return {}
  try {
    return (JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as WeightLog) ?? {}
  } catch {
    return {}
  }
}

function loadUnit(): Unit {
  try {
    return localStorage.getItem(UNIT_KEY) === 'kg' ? 'kg' : 'lb'
  } catch {
    return 'lb'
  }
}

export interface Weights {
  unit: Unit
  setUnit: (u: Unit) => void
  /** Sets logged for an exercise on a date. */
  setsFor: (date: string, exercise: string) => WorkoutSet[]
  /** Exercise names with at least one set on a date. */
  loggedExercises: (date: string) => string[]
  /** Does this date have any sets logged? */
  isLogged: (date: string) => boolean
  /** Replace the sets for one exercise on a date (empty array clears it). */
  saveSets: (date: string, exercise: string, sets: WorkoutSet[]) => void
  /** Every exercise you've ever logged, most-recent first. */
  allExercises: () => string[]
  /** Per-session history for one exercise, oldest → newest. */
  historyFor: (exercise: string) => SessionPoint[]
  /** True if anything at all has been logged. */
  hasAny: () => boolean
}

/** Keep only valid sets (positive weight or reps). */
function clean(sets: WorkoutSet[]): WorkoutSet[] {
  return sets
    .map((s) => ({ weight: Number(s.weight) || 0, reps: Number(s.reps) || 0 }))
    .filter((s) => s.weight > 0 || s.reps > 0)
}

/** App-wide weight log backed by localStorage. */
export function useWeights(): Weights {
  const [log, setLog] = useState<WeightLog>(loadLog)
  const [unit, setUnitState] = useState<Unit>(loadUnit)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(log))
    } catch {
      /* storage unavailable — fail quietly */
    }
  }, [log])

  // Keep other open tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setLog(loadLog())
      if (e.key === UNIT_KEY) setUnitState(loadUnit())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const setUnit = useCallback((u: Unit) => {
    setUnitState(u)
    try {
      localStorage.setItem(UNIT_KEY, u)
    } catch {
      /* ignore */
    }
  }, [])

  const setsFor = useCallback(
    (date: string, exercise: string) => log[date]?.[exercise] ?? [],
    [log],
  )

  const loggedExercises = useCallback(
    (date: string) => Object.keys(log[date] ?? {}).filter((ex) => (log[date][ex] ?? []).length > 0),
    [log],
  )

  const isLogged = useCallback(
    (date: string) => loggedExercises(date).length > 0,
    [loggedExercises],
  )

  const saveSets = useCallback((date: string, exercise: string, sets: WorkoutSet[]) => {
    setLog((prev) => {
      const forDate = { ...(prev[date] ?? {}) }
      const cleaned = clean(sets)
      if (cleaned.length === 0) {
        delete forDate[exercise]
      } else {
        forDate[exercise] = cleaned
      }
      const next = { ...prev }
      if (Object.keys(forDate).length === 0) delete next[date]
      else next[date] = forDate
      return next
    })
  }, [])

  const allExercises = useCallback(() => {
    // Collect exercises with their most recent date, then sort recent-first.
    const latest: Record<string, string> = {}
    for (const date of Object.keys(log)) {
      for (const ex of Object.keys(log[date])) {
        if (!latest[ex] || date > latest[ex]) latest[ex] = date
      }
    }
    return Object.keys(latest).sort((a, b) => latest[b].localeCompare(latest[a]))
  }, [log])

  const historyFor = useCallback(
    (exercise: string): SessionPoint[] => {
      const points: SessionPoint[] = []
      for (const date of Object.keys(log)) {
        const sets = log[date]?.[exercise]
        if (!sets || sets.length === 0) continue
        const top = sets.reduce((m, s) => Math.max(m, s.weight), 0)
        const volume = sets.reduce((v, s) => v + s.weight * s.reps, 0)
        points.push({ date, top, volume, sets: sets.length })
      }
      return points.sort((a, b) => a.date.localeCompare(b.date))
    },
    [log],
  )

  const hasAny = useCallback(() => Object.keys(log).length > 0, [log])

  return {
    unit,
    setUnit,
    setsFor,
    loggedExercises,
    isLogged,
    saveSets,
    allExercises,
    historyFor,
    hasAny,
  }
}
