// Core domain types for the LIIFT MORE tracker.

/**
 * A LIIFT MORE workout "method" — the muscle-group focus of the day. Drives the
 * colored tag/badge on each card.
 * chest = Chest & Triceps · back = Back & Biceps · legs = Legs ·
 * shoulders = Shoulders · totalbody = Total Body · rest = rest / recovery.
 */
export type MethodKey = 'chest' | 'back' | 'legs' | 'shoulders' | 'totalbody' | 'rest'

export interface MethodMeta {
  key: MethodKey
  /** Short label shown inside the pill tag (e.g. "CHEST & TRI"). */
  label: string
  /** Tailwind background class for the pill. */
  pillClass: string
  /** Tailwind text color for the pill label. */
  pillTextClass: string
  /** Tailwind background class for a tinted calendar cell. */
  tintClass: string
}

/** Where a day sits inside the fixed 8-week LIIFT MORE program. */
export interface ProgramInfo {
  /** Day number within the 56-day program (1–56). */
  day: number
  /** Week number (1–8). */
  week: number
  /** Day within the week (1–7; days 6–7 are rest). */
  dayInWeek: number
  /** Phase 1 = weeks 1–4 (strength & mass), Phase 2 = weeks 5–8 (lean & define). */
  phase: 1 | 2
  /** True on the final program day. */
  finale?: boolean
}

/** A single day's planned workout. */
export interface Workout {
  method: MethodKey
  /** The workout name, e.g. "Chest & Triceps", "Legs", "Shoulders". */
  title: string
  /** Optional extra note (focus / format) shown in detail views. */
  note?: string
  /** Optional link to the workout video (a Google Drive link). */
  link?: string
}

/** A day resolved against a real calendar date. */
export interface ScheduledDay extends Workout {
  /** ISO date string YYYY-MM-DD. Stable id used for completion tracking. */
  date: string
  /** 0 = Sunday … 6 = Saturday. */
  weekday: number
  /** Full day name, e.g. "Sunday". */
  dayName: string
  /** 3-letter uppercase abbreviation, e.g. "SUN". */
  dayShort: string
  /** Human label like "AUG 30". */
  dateLabel: string
  /** Present when this day falls inside the 8-week program window. */
  program?: ProgramInfo
}
