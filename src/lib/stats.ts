import { addDays, buildDay, getWeek, isSameDay, today } from './dates'

export interface Stats {
  /** Consecutive days kept (a day counts once it's checked off). */
  current: number
  /** Completed / total training days in the current week. */
  weekDone: number
  weekTotal: number
}

type IsDone = (iso: string) => boolean

/**
 * The streak is the number of consecutive days, ending now, that have been
 * checked off. Every day counts, including rest days (mark "rested" to keep
 * the streak alive). Today is allowed to be pending: a not-yet-checked today
 * doesn't break the streak, it just isn't counted until you check it.
 */
function currentStreak(isDone: IsDone): number {
  const now = today()
  let count = 0
  let cursor = new Date(now)
  let allowPendingToday = true

  for (let i = 0; i < 400; i++) {
    const day = buildDay(cursor)
    if (isDone(day.date)) {
      count += 1
    } else if (allowPendingToday && isSameDay(cursor, now)) {
      allowPendingToday = false // today not checked yet, keep the streak alive
    } else {
      break
    }
    cursor = addDays(cursor, -1)
  }
  return count
}

export function computeStats(isDone: IsDone): Stats {
  const week = getWeek(today()).filter((d) => d.method !== 'rest')
  const weekDone = week.reduce((n, d) => n + (isDone(d.date) ? 1 : 0), 0)
  return {
    current: currentStreak(isDone),
    weekDone,
    weekTotal: week.length,
  }
}
