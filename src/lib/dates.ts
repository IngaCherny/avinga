import type { ScheduledDay } from '../data/types'
import { workoutForWeekday } from '../data/schedule'
import { CHALLENGE_BY_DATE } from '../data/challenge'

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]
const DAY_SHORT = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const MONTHS_SHORT = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
]
const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/** Format a Date as a local YYYY-MM-DD string (no timezone surprises). */
export function toISO(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Parse a YYYY-MM-DD string into a local-midnight Date. */
export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** Return a new Date offset by `n` days. */
export function addDays(date: Date, n: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + n)
  return next
}

/** Today at local midnight. */
export function today(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

/** Are two dates the same calendar day? */
export function isSameDay(a: Date, b: Date): boolean {
  return toISO(a) === toISO(b)
}

/** The Sunday that begins the week containing `date`. */
export function startOfWeek(date: Date): Date {
  return addDays(date, -date.getDay())
}

/** "JUN 28" style label. */
export function dateLabel(date: Date): string {
  return `${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}`
}

export function monthLongLabel(year: number, month: number): string {
  return `${MONTHS_LONG[month]} ${year}`
}

export function monthName(month: number): string {
  return MONTHS_LONG[month]
}

/** Resolve a Date into a fully scheduled day (workout + labels). */
export function buildDay(date: Date): ScheduledDay {
  const weekday = date.getDay()
  const iso = toISO(date)
  // 560-Challenge overrides take precedence over the recurring template.
  const workout = CHALLENGE_BY_DATE[iso] ?? workoutForWeekday(weekday)
  return {
    ...workout,
    date: toISO(date),
    weekday,
    dayName: DAY_NAMES[weekday],
    dayShort: DAY_SHORT[weekday],
    dateLabel: dateLabel(date),
  }
}

/** The 7 scheduled days (Sun → Sat) of the week containing `ref`. */
export function getWeek(ref: Date): ScheduledDay[] {
  const start = startOfWeek(ref)
  return Array.from({ length: 7 }, (_, i) => buildDay(addDays(start, i)))
}

/** "JUN 28 · JUL 4" range label for a week array. */
export function weekRangeLabel(week: ScheduledDay[]): string {
  if (week.length === 0) return ''
  const first = parseISO(week[0].date)
  const last = parseISO(week[week.length - 1].date)
  return `${dateLabel(first)} · ${dateLabel(last)}`
}

export interface MonthCell {
  day: ScheduledDay
  inMonth: boolean
}

/**
 * Build a 6-row calendar matrix (Sun-first) for a given month, padded with
 * leading/trailing days so the grid is always rectangular.
 */
export function getMonthMatrix(year: number, month: number): MonthCell[][] {
  const firstOfMonth = new Date(year, month, 1)
  const gridStart = startOfWeek(firstOfMonth)
  const weeks: MonthCell[][] = []
  let cursor = gridStart
  for (let w = 0; w < 6; w++) {
    const row: MonthCell[] = []
    for (let d = 0; d < 7; d++) {
      row.push({ day: buildDay(cursor), inMonth: cursor.getMonth() === month })
      cursor = addDays(cursor, 1)
    }
    weeks.push(row)
  }
  return weeks
}
