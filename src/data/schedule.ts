import type { MethodKey, MethodMeta, Workout } from './types'

/**
 * Method metadata, colors are tuned to match the cozy training PDF.
 * BELLE = dusty rose · BUILD&BURN = mocha · RUN = terracotta · rest = muted.
 */
export const METHODS: Record<MethodKey, MethodMeta> = {
  belle: {
    key: 'belle',
    label: 'BELLE',
    pillClass: 'bg-belle',
    pillTextClass: 'text-white',
    tintClass: 'bg-[#F6E2E8]',
  },
  burn: {
    key: 'burn',
    label: 'BUILD&BURN',
    pillClass: 'bg-burn',
    pillTextClass: 'text-cream-card',
    tintClass: 'bg-[#EEDFD1]',
  },
  run: {
    key: 'run',
    label: 'RUN',
    pillClass: 'bg-run',
    pillTextClass: 'text-cream-card',
    tintClass: 'bg-[#F3DCCC]',
  },
  runclub: {
    key: 'runclub',
    label: 'RUN CLUB',
    pillClass: 'bg-runclub',
    pillTextClass: 'text-white',
    tintClass: 'bg-[#F1EAC6]',
  },
  wildcard: {
    key: 'wildcard',
    label: 'WILDCARD',
    pillClass: 'bg-wildcard',
    pillTextClass: 'text-white',
    tintClass: 'bg-[#E7DAED]',
  },
  rest: {
    key: 'rest',
    label: 'REST',
    pillClass: 'bg-resttag',
    pillTextClass: 'text-white',
    tintClass: 'bg-[#E7DCD2]',
  },
}

/**
 * Per-weekday badge color (the little circle with SUN/MON/…).
 * Mirrors the warm-tone progression in the PDF.
 * Index 0 = Sunday … 6 = Saturday.
 */
export const WEEKDAY_BADGE: { bg: string; text: string }[] = [
  { bg: 'bg-belle', text: 'text-white' }, // Sun
  { bg: 'bg-camel', text: 'text-white' }, // Mon
  { bg: 'bg-clay', text: 'text-white' }, // Tue
  { bg: 'bg-clay', text: 'text-white' }, // Wed
  { bg: 'bg-rose', text: 'text-white' }, // Thu
  { bg: 'bg-run', text: 'text-white' }, // Fri
  { bg: 'bg-resttag', text: 'text-white' }, // Sat
]

export const REST: Workout = { method: 'rest', title: 'rest & restore' }

/**
 * The recurring weekly training template, keyed by weekday (0 = Sun … 6 = Sat).
 * This is the single source of truth, edit here to update the whole app, and
 * it repeats automatically for every week and month.
 *
 * Taken from the "JUN 28 · JUL 4" plan: Belle Method & Build&Burn.
 */
export const WEEKLY_TEMPLATE: Record<number, Workout> = {
  0: { method: 'belle', title: 'Lower Body', note: 'Belle Method · glutes & legs' },
  1: { method: 'burn', title: 'Upper Body', note: 'Build&Burn · push + pull' },
  2: { method: 'burn', title: 'Pilates', note: 'Build&Burn · core & control' },
  3: { method: 'burn', title: 'Lower Body', note: 'Build&Burn · strength' },
  4: { method: 'belle', title: 'Upper Body', note: 'Belle Method · sculpt' },
  5: { method: 'run', title: '20 min + Core', note: 'Easy run + core finisher' },
  6: REST, // Saturday, rest & restore
}

/**
 * Per-date overrides for the CURRENT week only (video links etc.), merged on
 * top of the recurring plan. These change every week, so update just this map
 * when new links arrive. Keyed by ISO date (YYYY-MM-DD).
 */
export const DATED_OVERRIDES: Record<string, Partial<Workout>> = {
  // Week of Jun 28 – Jul 4 (Build & Burn videos)
  '2026-06-30': { link: 'http://watch.buildandburn.co/videos/c1515' }, // Pilates
  '2026-07-01': { link: 'http://watch.buildandburn.co/videos/c1519' }, // Lower Body
}

/** The meta line shown under the title. */
export const PLAN_SUBTITLE = 'Belle Method & Build&Burn · move, sweat, repeat'
export const PLAN_TAGLINE = 'your sweaty week, busy girl'
export const FOOTER_NOTE = "consistency over perfection, you've got this!"

/** Look up the planned workout for any weekday. */
export function workoutForWeekday(weekday: number): Workout {
  return WEEKLY_TEMPLATE[weekday] ?? REST
}
