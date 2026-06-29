import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_PERSON_ID, resolvePersonId } from '../data/people'

const STORAGE_KEY = 'sweaty-week:v1'

/**
 * Read a personal deep-link like `?me=aviv` (or `?me=inga`). Lets each friend
 * bookmark a link that always opens on their own tab. Returns a person id or
 * null if there's no (valid) `me` param.
 */
function personFromUrl(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return resolvePersonId(new URLSearchParams(window.location.search).get('me'))
  } catch {
    return null
  }
}

interface TrackerState {
  activePerson: string
  /** completed[personId][isoDate] = true */
  completed: Record<string, Record<string, boolean>>
}

function emptyState(): TrackerState {
  return { activePerson: DEFAULT_PERSON_ID, completed: {} }
}

function load(): TrackerState {
  // A `?me=` link always wins for the initial active person, so a bookmarked
  // personal link lands on the right tab regardless of what's stored.
  const urlPerson = personFromUrl()
  if (typeof localStorage === 'undefined') {
    return { ...emptyState(), activePerson: urlPerson ?? DEFAULT_PERSON_ID }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...emptyState(), activePerson: urlPerson ?? DEFAULT_PERSON_ID }
    const parsed = JSON.parse(raw) as Partial<TrackerState>
    return {
      activePerson: urlPerson ?? parsed.activePerson ?? DEFAULT_PERSON_ID,
      completed: parsed.completed ?? {},
    }
  } catch {
    return { ...emptyState(), activePerson: urlPerson ?? DEFAULT_PERSON_ID }
  }
}

function persist(state: TrackerState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* storage may be unavailable (private mode) — fail quietly */
  }
}

export interface Tracker {
  activePerson: string
  setActivePerson: (id: string) => void
  isDone: (isoDate: string) => boolean
  toggle: (isoDate: string) => void
  /** How many of the given dates are completed by the active person. */
  countDone: (isoDates: string[]) => number
}

/** App-wide tracker backed by localStorage, scoped per person. */
export function useTracker(): Tracker {
  const [state, setState] = useState<TrackerState>(load)

  useEffect(() => {
    persist(state)
  }, [state])

  // After a `?me=` link has set the initial person, remove it from the URL so
  // that if this person later switches tabs on this device, their choice
  // sticks (the link no longer forces it back on the next reload).
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (!params.has('me')) return
    params.delete('me')
    const qs = params.toString()
    const url = window.location.pathname + (qs ? `?${qs}` : '') + window.location.hash
    window.history.replaceState({}, '', url)
  }, [])

  // Keep multiple open tabs / windows in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setState(load())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const setActivePerson = useCallback((id: string) => {
    setState((s) => ({ ...s, activePerson: id }))
  }, [])

  const isDone = useCallback(
    (isoDate: string) => Boolean(state.completed[state.activePerson]?.[isoDate]),
    [state],
  )

  const toggle = useCallback((isoDate: string) => {
    setState((s) => {
      const person = s.activePerson
      const forPerson = { ...(s.completed[person] ?? {}) }
      if (forPerson[isoDate]) {
        delete forPerson[isoDate]
      } else {
        forPerson[isoDate] = true
      }
      return { ...s, completed: { ...s.completed, [person]: forPerson } }
    })
  }, [])

  const countDone = useCallback(
    (isoDates: string[]) => {
      const forPerson = state.completed[state.activePerson] ?? {}
      return isoDates.reduce((n, d) => n + (forPerson[d] ? 1 : 0), 0)
    },
    [state],
  )

  return {
    activePerson: state.activePerson,
    setActivePerson,
    isDone,
    toggle,
    countDone,
  }
}
