import type { Workout } from '../data/types'

/**
 * On-device store for the *purchased* 560 Challenge details (video links, notes,
 * custom titles). This data is kept ONLY in the browser's localStorage — it is
 * never committed to the repo or shipped in the public build, so the paid
 * program stays private. Import it per device via the in-app "Private plan"
 * dialog.
 */
const KEY = 'sweaty-week:challenge-private:v1'

/** The private overrides you can attach to a challenge day (all optional). */
export type PrivateDay = Partial<Pick<Workout, 'title' | 'note' | 'link'>>

/** Keyed by challenge day number as a string, e.g. { "1": { link, note } }. */
export type PrivateChallenge = Record<string, PrivateDay>

let cache: PrivateChallenge | null = null

export function getPrivateChallenge(): PrivateChallenge {
  if (cache) return cache
  if (typeof localStorage === 'undefined') return (cache = {})
  try {
    cache = (JSON.parse(localStorage.getItem(KEY) || '{}') as PrivateChallenge) ?? {}
  } catch {
    cache = {}
  }
  return cache
}

export function savePrivateChallenge(data: PrivateChallenge): void {
  cache = data
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    /* storage may be unavailable (private mode) — fail quietly */
  }
}

export function clearPrivateChallenge(): void {
  cache = {}
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}

/** How many challenge days currently have private details loaded. */
export function privateDayCount(): number {
  return Object.keys(getPrivateChallenge()).length
}

/** Private overrides for a given challenge day number, if any. */
export function privateDayFor(day?: number): PrivateDay | undefined {
  if (!day) return undefined
  const entry = getPrivateChallenge()[String(day)]
  if (!entry) return undefined
  // Only keep the fields we recognise, and drop empty strings.
  const out: PrivateDay = {}
  if (entry.title) out.title = entry.title
  if (entry.note) out.note = entry.note
  if (entry.link) out.link = entry.link
  return Object.keys(out).length ? out : undefined
}

/**
 * Normalise arbitrary imported JSON into a PrivateChallenge map. Accepts either
 * an object keyed by day number ({ "1": {...} }) or an array of { day, ... }.
 * Unknown fields (like a "label" hint) are ignored.
 */
export function parseImported(raw: unknown): PrivateChallenge {
  const out: PrivateChallenge = {}
  const add = (day: unknown, v: Record<string, unknown>) => {
    const n = Number(day)
    if (!Number.isInteger(n) || n < 1 || n > 60) return
    const entry: PrivateDay = {}
    if (typeof v.title === 'string' && v.title.trim()) entry.title = v.title.trim()
    if (typeof v.note === 'string' && v.note.trim()) entry.note = v.note.trim()
    if (typeof v.link === 'string' && v.link.trim()) entry.link = v.link.trim()
    if (Object.keys(entry).length) out[String(n)] = entry
  }
  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (item && typeof item === 'object') add((item as Record<string, unknown>).day, item as Record<string, unknown>)
    }
  } else if (raw && typeof raw === 'object') {
    for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
      if (v && typeof v === 'object') add(k, v as Record<string, unknown>)
    }
  }
  return out
}
