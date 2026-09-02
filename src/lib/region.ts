/**
 * Which weekday the training week starts on.
 *
 * Everyone defaults to Monday–Friday. Anyone who trains Sunday–Thursday flips
 * the "my week" toggle on the Weekly tab once, and that choice is remembered on
 * their device.
 */
export type WeekStart = 0 | 1 // 0 = Sunday (lift Sun-Thu) · 1 = Monday (lift Mon-Fri)

const KEY = 'liift-more:week-start:v1'

/** The default for anyone who hasn't chosen: Monday–Friday. */
export const DEFAULT_WEEK_START: WeekStart = 1

function load(): WeekStart {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === '0' || saved === '1') return Number(saved) as WeekStart
  } catch {
    /* storage unavailable — fall through to the default */
  }
  return DEFAULT_WEEK_START
}

// Module-level so the date helpers can read it without threading it through
// every component. Kept in sync with React state by App.
let current: WeekStart = load()

export function getWeekStart(): WeekStart {
  return current
}

export function setWeekStart(w: WeekStart): void {
  current = w
  try {
    localStorage.setItem(KEY, String(w))
  } catch {
    /* ignore */
  }
}
