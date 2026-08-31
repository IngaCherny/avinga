import type { MethodKey, MethodMeta, ProgramInfo, Workout } from './types'

/**
 * Method metadata. Colors stay in the warm cream/mocha family from the original
 * design, with one distinct accent per muscle-group day so the week reads at a
 * glance.
 */
export const METHODS: Record<MethodKey, MethodMeta> = {
  chest: {
    key: 'chest',
    label: 'CHEST & TRI',
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
    label: 'BACK & BI',
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
 * LIIFT MORE (Joel Freeman · BODi) is a fixed 8-week program: 5 lifting days
 * (LIFT + HIIT + core) and 2 rest days each week, across two phases —
 * Phase 1 (weeks 1–4, strength & mass) and Phase 2 (weeks 5–8, lean & define).
 *
 * Day 1 is anchored to PROGRAM_START. Change this one date to re-align the whole
 * calendar with when you actually started.
 */
export const PROGRAM_START = '2026-08-30' // Day 1 · Week 1
export const PROGRAM_WEEKS = 8
export const PROGRAM_TOTAL = PROGRAM_WEEKS * 7 // 56 days

/**
 * The recurring weekly split, keyed by day-within-week (1 → Day 1 … 7 → Day 7).
 * Days 6 & 7 are rest. This repeats for all 8 weeks; per-day tweaks (e.g. a
 * different Phase-2 title) go in DAY_OVERRIDES below.
 */
export const WEEK_PATTERN: Record<number, Workout> = {
  1: { method: 'chest', title: 'Chest & Triceps', note: 'LIFT + HIIT + core' },
  2: { method: 'legs', title: 'Legs', note: 'LIFT + HIIT + core' },
  3: { method: 'back', title: 'Back & Biceps', note: 'LIFT + HIIT + core' },
  4: { method: 'legs', title: 'Legs', note: 'LIFT + HIIT + core' },
  5: { method: 'shoulders', title: 'Shoulders', note: 'LIFT + HIIT + core' },
  6: REST, // rest / recovery
  7: REST, // rest / recovery
}

/**
 * Per-program-day overrides (1–56), merged on top of WEEK_PATTERN. Use this to
 * rename a specific day, add a focus note, or tweak the split for Phase 2 —
 * without touching the recurring pattern. Leave empty to run the plain split.
 *
 * Example:
 *   29: { title: 'Total Body', method: 'totalbody', note: 'Phase 2 · full-body burner' },
 */
export const DAY_OVERRIDES: Record<number, Partial<Workout>> = {}

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

/** The planned workout for a program day, pattern + any override. */
export function workoutForProgramDay(info: ProgramInfo): Workout {
  const base = WEEK_PATTERN[info.dayInWeek] ?? REST
  const override = DAY_OVERRIDES[info.day]
  return override ? { ...base, ...override } : base
}

/* ------------------------------------------------------------------ */
/*  VIDEOS — your Google Drive                                         */
/* ------------------------------------------------------------------ */

/**
 * Your Drive folder that holds the LIIFT MORE videos. Every "Watch" button opens
 * here until a specific per-day video is mapped below.
 */
export const DRIVE_FOLDER_URL =
  'https://drive.google.com/drive/folders/1Sl9gDZg8CPjqa2r7lZlNtOLMvlCUqNDG'

/**
 * Map each program day (1–56) to its Google Drive video FILE ID, so tapping
 * "Watch" opens that exact video. To get a file ID: open the video in Drive →
 * Share → Copy link. The link looks like
 *   https://drive.google.com/file/d/THE_FILE_ID/view?usp=sharing
 * Paste just THE_FILE_ID here. Days left out fall back to the folder above.
 *
 * Example:
 *   1: '1AbCdEf...',   // Week 1 · Day 1 · Chest & Triceps
 */
export const VIDEO_FILE_IDS: Record<number, string> = {}

/** The Drive URL to open for a given program day. */
export function videoUrlFor(day: number): string {
  const id = VIDEO_FILE_IDS[day]
  return id ? `https://drive.google.com/file/d/${id}/view` : DRIVE_FOLDER_URL
}

/* ------------------------------------------------------------------ */
/*  Copy                                                               */
/* ------------------------------------------------------------------ */

export const PLAN_SUBTITLE = 'LIIFT MORE · lift heavy, burn more, repeat'
export const PLAN_TAGLINE = 'your lift week, let’s go'
export const FOOTER_NOTE = "consistency over perfection, you've got this!"
