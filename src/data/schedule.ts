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
  yoga: {
    key: 'yoga',
    label: 'YOGA',
    pillClass: 'bg-yoga',
    pillTextClass: 'text-white',
    tintClass: 'bg-[#EFE4EB]',
  },
  rest: {
    key: 'rest',
    label: 'REST',
    pillClass: 'bg-resttag',
    pillTextClass: 'text-white',
    tintClass: 'bg-[#E7DCD2]',
  },
}

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
  // Week of Jun 28 – Jul 4
  '2026-06-30': { link: 'http://watch.buildandburn.co/videos/c1515' }, // Build&Burn Pilates
  '2026-07-01': { link: 'http://watch.buildandburn.co/videos/c1519' }, // Build&Burn Lower Body
  '2026-07-02': { link: 'https://thebellemethod.com/challenge-course/living-room-lift/?action=workouts' }, // Belle Upper Body

  // Week of Jul 5 – Jul 11 (differs from the recurring template, so each day is
  // fully overridden here). Saturday falls back to the template's rest day.
  // The Belle days all live in the "living-room-lift" course; open it and pick
  // the day inside (the site has no per-workout URL — see note below).
  '2026-07-05': {
    method: 'belle',
    title: 'Total Body',
    note: 'Belle Method · week 3',
    link: 'https://thebellemethod.com/challenge-course/living-room-lift/?action=workout',
  },
  '2026-07-06': { method: 'burn', title: 'Lower Body', note: 'Build&Burn · strength' }, // link TBD
  '2026-07-07': {
    method: 'belle',
    title: 'Upper Body',
    note: 'Belle Method · week 4',
    link: 'https://thebellemethod.com/challenge-course/living-room-lift/?action=workout',
  },
  '2026-07-08': {
    method: 'belle',
    title: 'Lower Body',
    note: 'Belle Method · week 4',
    link: 'https://thebellemethod.com/challenge-course/living-room-lift/?action=workout',
  },
  '2026-07-09': { method: 'yoga', title: 'Yoga', note: 'flow & restore' }, // link TBD
  '2026-07-10': {
    method: 'run',
    title: '25 min Run + Core Rehab',
    note: 'Belle Method · diastasis core rehab (wk 2 · workout 1)',
    link: 'https://thebellemethod.com/challenge-course/diastasis-kickstart-in-30/?action=workout',
  },

  // Week of Jul 12 – Jul 18. The Belle days share the "living-room-lift" course
  // link. Saturday falls back to the template's rest day.
  '2026-07-12': {
    method: 'belle',
    title: 'Total Body',
    note: 'Belle Method',
    link: 'https://thebellemethod.com/challenge-course/living-room-lift/?action=workout',
  },
  '2026-07-13': { method: 'burn', title: 'Lower Body', note: 'Build&Burn' },
  '2026-07-14': { method: 'burn', title: 'Upper Body', note: 'Build&Burn' },
  '2026-07-15': {
    method: 'belle',
    title: 'Lower Body',
    note: 'Belle Method',
    link: 'https://thebellemethod.com/challenge-course/living-room-lift/?action=workout',
  },
  '2026-07-16': {
    method: 'belle',
    title: 'Upper Body',
    note: 'Belle Method',
    link: 'https://thebellemethod.com/challenge-course/living-room-lift/?action=workout',
  },
  '2026-07-17': { method: 'run', title: '25 min Run', note: 'Easy run' },
}

/** The meta line shown under the title. */
export const PLAN_SUBTITLE = 'Belle Method & Build&Burn · move, sweat, repeat'
export const PLAN_TAGLINE = 'your sweaty week, busy girl'
export const FOOTER_NOTE = "consistency over perfection, you've got this!"

/** Look up the planned workout for any weekday. */
export function workoutForWeekday(weekday: number): Workout {
  return WEEKLY_TEMPLATE[weekday] ?? REST
}

/** A once-a-week nutrition / habit focus shown as its own card. */
export interface WeeklyChallenge {
  /** Short kicker, e.g. "Hydration first". */
  title: string
  /** The actual challenge, one or two sentences. */
  detail: string
}

/**
 * Weekly nutrition challenges, keyed by the Sunday that starts the week
 * (YYYY-MM-DD). Add next week's here and the card appears automatically when
 * that week is in view.
 */
export const NUTRITION_CHALLENGES: Record<string, WeeklyChallenge> = {
  // Week of Jul 5 – Jul 11
  '2026-07-05': {
    title: 'Hydration first',
    detail:
      'Drink 2 glasses of water before every meal, snack — or even the urge to snack. Thirst first, then decide.',
  },
}

/** The nutrition challenge for the week that starts on `weekStartISO`, if any. */
export function challengeForWeek(weekStartISO: string): WeeklyChallenge | undefined {
  return NUTRITION_CHALLENGES[weekStartISO]
}

/**
 * The challenge to surface on the always-on dashboard: this week's if it has
 * one, otherwise the soonest upcoming, otherwise the most recent past — so the
 * reminder is always visible once any challenge exists.
 */
export function dashboardChallenge(weekStartISO: string): WeeklyChallenge | undefined {
  const keys = Object.keys(NUTRITION_CHALLENGES).sort()
  if (keys.length === 0) return undefined
  if (NUTRITION_CHALLENGES[weekStartISO]) return NUTRITION_CHALLENGES[weekStartISO]
  const upcoming = keys.find((k) => k > weekStartISO)
  return NUTRITION_CHALLENGES[upcoming ?? keys[keys.length - 1]]
}
