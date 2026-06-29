import { addDays, buildDay, getWeek, isSameDay, parseISO, today } from './dates'

export interface Stats {
  /** Consecutive completed workouts up to now (rest days don't break it). */
  current: number
  /** Best run of consecutive completed workouts ever. */
  longest: number
  /** Total workouts completed all-time. */
  total: number
  /** Completed / total training days in the current week. */
  weekDone: number
  weekTotal: number
}

type IsDone = (iso: string) => boolean

/**
 * Streaks count completed *training* days in a row. Rest days are transparent:
 * they neither add to nor break a streak. Today is allowed to be "pending" so a
 * not-yet-done workout today doesn't look like a broken streak.
 */
function currentStreak(isDone: IsDone): number {
  const now = today()
  let count = 0
  let cursor = new Date(now)
  let allowPendingToday = true

  for (let i = 0; i < 400; i++) {
    const day = buildDay(cursor)
    if (day.method === 'rest') {
      cursor = addDays(cursor, -1)
      continue
    }
    if (isDone(day.date)) {
      count += 1
    } else if (allowPendingToday && isSameDay(cursor, now)) {
      allowPendingToday = false // today not logged yet, keep the streak alive
    } else {
      break
    }
    cursor = addDays(cursor, -1)
  }
  return count
}

function longestStreak(isDone: IsDone, doneDates: string[]): number {
  if (doneDates.length === 0) return 0
  const earliest = doneDates.reduce((min, d) => (d < min ? d : min), doneDates[0])
  const end = today()
  let cursor = parseISO(earliest)
  let run = 0
  let best = 0
  while (cursor <= end) {
    const day = buildDay(cursor)
    if (day.method !== 'rest') {
      if (isDone(day.date)) {
        run += 1
        best = Math.max(best, run)
      } else {
        run = 0
      }
    }
    cursor = addDays(cursor, 1)
  }
  return best
}

export function computeStats(isDone: IsDone, doneDates: string[]): Stats {
  const week = getWeek(today()).filter((d) => d.method !== 'rest')
  const weekDone = week.reduce((n, d) => n + (isDone(d.date) ? 1 : 0), 0)
  return {
    current: currentStreak(isDone),
    longest: longestStreak(isDone, doneDates),
    total: doneDates.length,
    weekDone,
    weekTotal: week.length,
  }
}
