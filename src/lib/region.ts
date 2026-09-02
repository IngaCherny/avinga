/**
 * Which weekday the training week starts on.
 *
 * The app has no accounts, so there's no login to read a country from. We
 * detect it from the device's timezone instead: an Israel timezone runs the
 * Sunday-Thursday working week, everywhere else defaults to Monday-Friday.
 * The viewer can override it, and the choice is remembered on that device.
 */
export type WeekStart = 0 | 1 // 0 = Sunday (lift Sun-Thu) · 1 = Monday (lift Mon-Fri)

const KEY = 'liift-more:week-start:v1'

/** Timezones whose working week runs Sunday to Thursday. */
const SUN_THU_ZONES = ['Asia/Jerusalem', 'Asia/Tel_Aviv', 'Israel']

/** Best guess from the device's timezone. */
export function detectWeekStart(): WeekStart {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    return SUN_THU_ZONES.includes(tz) ? 0 : 1
  } catch {
    return 1
  }
}

function load(): WeekStart {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === '0' || saved === '1') return Number(saved) as WeekStart
  } catch {
    /* storage unavailable — fall through to detection */
  }
  return detectWeekStart()
}

// Module-level so the date helpers can read it without threading it through
// every component. Kept in sync with React state by useWeekStart().
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

/** True when the viewer hasn't overridden the detected value. */
export function isAutoDetected(): boolean {
  try {
    return localStorage.getItem(KEY) === null
  } catch {
    return true
  }
}
