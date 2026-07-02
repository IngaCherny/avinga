// Core domain types for the workout tracker.

/** A training "method" / category. Drives the colored tag on each card. */
export type MethodKey = 'belle' | 'burn' | 'run' | 'runclub' | 'wildcard' | 'yoga' | 'rest'

export interface MethodMeta {
  key: MethodKey
  /** Short label shown inside the pill tag (e.g. "BELLE"). */
  label: string
  /** Tailwind background class for the pill. */
  pillClass: string
  /** Tailwind text color for the pill label. */
  pillTextClass: string
  /** Tailwind background class for a tinted calendar cell. */
  tintClass: string
}

/** 560-Challenge metadata attached to a day inside the challenge window. */
export interface ChallengeInfo {
  /** Day number within the 60-day challenge (1–60). */
  day: number
  /** The "original 560 workout" to swap in when travelling (faint label). */
  swap?: string
  /** Benchmark / level-up day (★). */
  levelUp?: boolean
  /** The final day of the challenge. */
  finale?: boolean
}

/** A single day's planned workout. */
export interface Workout {
  method: MethodKey
  /** The workout name, e.g. "Lower Body", "Pilates", "20 min + Core". */
  title: string
  /** Optional extra note (sets/reps/focus) shown in detail views. */
  note?: string
  /** Optional link to the workout video. */
  link?: string
  /** Present when this day is part of the 560 Challenge. */
  challenge?: ChallengeInfo
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
  /** Human label like "JUN 28". */
  dateLabel: string
}
