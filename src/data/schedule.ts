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
 * core) with the weekend to rest. Day 1 is anchored per region: an Israel
 * timezone lifts Sun–Thu, everywhere else lifts Mon–Fri (see lib/region.ts).
 *
 * LIIFT MORE is a full 8-week program (two 4-week phases). Videos are wired for
 * Weeks 1–3 below; Weeks 4–8 fall back to opening the Drive folder until their
 * per-video links are added to VIDEO_FILE_IDS.
 */
/**
 * Day 1 of Week 1, per week shape. The two anchors are one day apart so each
 * region gets the same 5 lift days on its own working week:
 *   Sunday start  -> lifts land Sun-Thu, rest Fri-Sat
 *   Monday start  -> lifts land Mon-Fri, rest Sat-Sun
 */
export const PROGRAM_START_BY_WEEK_START: Record<WeekStart, string> = {
  0: '2026-08-30', // Sunday
  1: '2026-08-31', // Monday
}

/** Day 1 for the viewer's current week shape. */
export function programStart(): string {
  return PROGRAM_START_BY_WEEK_START[getWeekStart()]
}
export const PROGRAM_WEEKS = 8
export const PROGRAM_TOTAL = PROGRAM_WEEKS * 7 // 56 days (8 weeks)

/**
 * The weekly split, keyed by day-within-week (1 -> Day 1 ... 7 -> Day 7), with
 * days 6 & 7 as rest. Transcribed from the program's official Workout Calendar:
 * the split CHANGES between the two phases.
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
  1: { method: 'chest', title: 'Chest & Back' },
  2: { method: 'legs', title: 'Legs' },
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
 * Confirmed against the Week 1-3 video filenames: odd weeks run LIFT on days
 * 1/3/5, even weeks flip it.
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
export const VIDEO_FILE_IDS: Record<number, string> = {
  // ── Week 1 (program days 1–5) ──
  1: '1t87M72mAH87TDevY5RJRh4xhbt-k2s21', // Day 1 · Chest & Biceps
  2: '1iIDD0byymeyjZq6BpRhccVSWOsZUTNkb', // Day 2 · Quads & Calves
  3: '1wedELYYdsmqmoDtacotH7ons0sMoOUYY', // Day 3 · Back & Triceps
  4: '14bAogRvfTlT7z3RQBqA6F-c7aV194X4E', // Day 4 · Hamstrings & Glutes
  5: '1kLem3MXYgYXSKcVD-hKXP_ol8mgmyQCU', // Day 5 · Shoulders
  // ── Week 2 (program days 8–12) ──
  8: '1mx0l_h8iA2zZrjc_CGSU9vBPp__OWHHc', // Day 1 · Chest & Biceps
  9: '1GC2gRkTdZFtY3Ei8Ra_uVWjnVBEqaWwN', // Day 2 · Quads & Calves
  10: '1FrY6O6EJ0C2k39h_Zu-p5AnDcoorsBrg', // Day 3 · Back & Triceps
  11: '189-q3D9N9Mdl77ka4iByNFeASLQOrHMq', // Day 4 · Hamstrings & Glutes
  12: '10AChNHdwT-9kCC8oQq2AG6I_XQLSEP_s', // Day 5 · Shoulders
  // ── Week 3 (program days 15–19) ──
  15: '1ye674xBnXN8cpBuOizoyaPEwmusv6Ms2', // Day 1 · Chest & Biceps
  16: '11RgfoYbsZ_dCAA5SgUKY_1QmE6KKhXU5', // Day 2 · Quads & Calves
  17: '1sLjTGIlxZKlp2cHJbPTUDyIz4n2LOY0G', // Day 3 · Back & Triceps
  18: '1iTd77Mja8OCjBL_Kh0RscaUi9ca2t_tm', // Day 4 · Hamstrings & Glutes
  19: '1VN638a9lPeBQ0PBRX62qD-dqMFM13F7e', // Day 5 · Shoulders

  // ── Weeks 4–8: not uploaded yet — Watch opens the Drive folder until these
  //    file IDs are filled in. Program-day numbers for each lifting day:
  // Week 4 → 22, 23, 24, 25, 26
  // Week 5 → 29, 30, 31, 32, 33
  // Week 6 → 36, 37, 38, 39, 40
  // Week 7 → 43, 44, 45, 46, 47
  // Week 8 → 50, 51, 52, 53, 54
}

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
