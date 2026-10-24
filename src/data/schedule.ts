import type { MethodKey, MethodMeta, ProgramInfo, Workout } from './types'
import { getWeekStart, type WeekStart } from '../lib/region'

/**
 * Method metadata. Colors stay in the warm cream/mocha family from the original
 * design, with one distinct accent per muscle-group day so the week reads at a
 * glance.
 */
export const METHODS: Record<MethodKey, MethodMeta> = {
  chest: {
    key: 'chest',
    label: 'CHEST',
    pillClass: 'bg-chest',
    pillTextClass: 'text-white',
    tintClass: 'bg-[#F6DED6]',
  },
  legs: {
    key: 'legs',
    label: 'LEGS',
    pillClass: 'bg-legs',
    pillTextClass: 'text-white',
    tintClass: 'bg-[#F1E4C8]',
  },
  back: {
    key: 'back',
    label: 'BACK',
    pillClass: 'bg-back',
    pillTextClass: 'text-white',
    tintClass: 'bg-[#E6EFD9]',
  },
  shoulders: {
    key: 'shoulders',
    label: 'SHOULDERS',
    pillClass: 'bg-shoulders',
    pillTextClass: 'text-white',
    tintClass: 'bg-[#EFDFEC]',
  },
  totalbody: {
    key: 'totalbody',
    label: 'TOTAL BODY',
    pillClass: 'bg-totalbody',
    pillTextClass: 'text-white',
    tintClass: 'bg-[#DEE6F1]',
  },
  arms: {
    key: 'arms',
    label: 'ARMS',
    pillClass: 'bg-arms',
    pillTextClass: 'text-white',
    tintClass: 'bg-[#EFDCE2]',
  },
  rest: {
    key: 'rest',
    label: 'REST',
    pillClass: 'bg-resttag',
    pillTextClass: 'text-white',
    tintClass: 'bg-[#E7DCD2]',
  },
}

export const REST: Workout = { method: 'rest', title: 'rest & recover' }

/* ------------------------------------------------------------------ */
/*  THE PROGRAM                                                         */
/* ------------------------------------------------------------------ */

/**
 * LIIFT MORE (Joel Freeman · BODi) runs 5 lifting days (Mon–Fri: LIFT + HIIT +
 * core) with the weekend to rest. Day 1 is anchored per week shape: Mon–Fri by
 * default, or Sun–Thu for anyone who flips the toggle (see lib/region.ts).
 *
 * LIIFT MORE is a full 8-week program (two 4-week phases). Each workout has its
 * own Drive video, linked per-device (see lib/links.ts) rather than in source.
 */
/**
 * Day 1 of Week 1, per week shape. The two anchors are one day apart so each
 * region gets the same 5 lift days on its own working week:
 *   Sunday start  -> lifts land Sun-Thu, rest Fri-Sat
 *   Monday start  -> lifts land Mon-Fri, rest Sat-Sun
 */
export const PROGRAM_START_BY_WEEK_START: Record<WeekStart, string> = {
  0: '2026-10-25', // Sunday
  1: '2026-10-26', // Monday
}

/** Day 1 for the viewer's current week shape. */
export function programStart(): string {
  return PROGRAM_START_BY_WEEK_START[getWeekStart()]
}
export const PROGRAM_WEEKS = 8
export const PROGRAM_TOTAL = PROGRAM_WEEKS * 7 // 56 days (8 weeks)

/**
 * The weekly split, keyed by day-within-week (1 -> Day 1 ... 7 -> Day 7), with
 * days 6 & 7 as rest. The split CHANGES between the two phases. Both patterns
 * are confirmed against all 40 video filenames (Weeks 1–8).
 */
export const PHASE1_PATTERN: Record<number, Workout> = {
  1: { method: 'chest', title: 'Chest & Biceps' },
  2: { method: 'legs', title: 'Quads & Calves' },
  3: { method: 'back', title: 'Back & Triceps' },
  4: { method: 'legs', title: 'Hamstrings & Glutes' },
  5: { method: 'shoulders', title: 'Shoulders' },
  6: REST,
  7: REST,
}

export const PHASE2_PATTERN: Record<number, Workout> = {
  1: { method: 'legs', title: 'Legs' },
  2: { method: 'chest', title: 'Chest & Back' },
  3: { method: 'shoulders', title: 'Shoulders' },
  4: { method: 'legs', title: 'More Legs' },
  5: { method: 'arms', title: 'Arms' },
  6: REST,
  7: REST,
}

/**
 * Per-program-day overrides (1-56), merged on top of the phase pattern. Use this
 * to rename a specific day or add a focus note without touching the patterns.
 */
export const DAY_OVERRIDES: Record<number, Partial<Workout>> = {}

/**
 * Each workout alternates between a straight LIFT and a LIFT + HIIT session.
 * Confirmed against every video filename (40 of 40 match): odd weeks run LIFT
 * on days 1/3/5, even weeks flip it.
 */
export function workoutFormat(week: number, dayInWeek: number): string {
  return (week + dayInWeek) % 2 === 0 ? 'LIFT + core' : 'LIFT + HIIT + core'
}

/** Phase label for a given week (1–8). */
export function phaseLabel(phase: 1 | 2): string {
  return phase === 1 ? 'Phase 1 · Strength & Mass' : 'Phase 2 · Lean & Define'
}

/**
 * Resolve a program-day number (1–56) into its ProgramInfo, or null if the date
 * is outside the 8-week window.
 */
export function programInfoForDay(day: number): ProgramInfo | null {
  if (day < 1 || day > PROGRAM_TOTAL) return null
  const week = Math.floor((day - 1) / 7) + 1
  const dayInWeek = ((day - 1) % 7) + 1
  const phase: 1 | 2 = week <= 4 ? 1 : 2
  return { day, week, dayInWeek, phase, finale: day === PROGRAM_TOTAL }
}

/** The planned workout for a program day: phase pattern + format note + override. */
export function workoutForProgramDay(info: ProgramInfo): Workout {
  const pattern = info.phase === 1 ? PHASE1_PATTERN : PHASE2_PATTERN
  const base = pattern[info.dayInWeek] ?? REST
  if (base.method === 'rest') return base
  const withNote: Workout = { ...base, note: workoutFormat(info.week, info.dayInWeek) }
  const override = DAY_OVERRIDES[info.day]
  return override ? { ...withNote, ...override } : withNote
}

/* ------------------------------------------------------------------ */
/*  VIDEOS                                                             */
/* ------------------------------------------------------------------ */

/**
 * The Drive links used to live here, which meant the public repository listed
 * every video in the official program. They now live on each device instead -
 * see lib/links.ts, and paste your bundle in on the Progress tab.
 *
 * `videoUrlFor(day)` is re-exported from there so callers are unchanged; it
 * returns undefined when this device has no links yet, and the Watch button
 * simply doesn't render.
 */
export { videoUrlFor } from '../lib/links'

/* ------------------------------------------------------------------ */
/*  Copy                                                               */
/* ------------------------------------------------------------------ */

export const PLAN_SUBTITLE = 'LIIFT MORE · lift heavy, burn more, repeat'
export const PLAN_TAGLINE = 'your lift week, let’s go'
export const FOOTER_NOTE = "consistency over perfection, you've got this!"
