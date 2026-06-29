import type { Workout } from './types'

/**
 * The 560 Challenge, a 60-day block that overlays the normal lift-first plan,
 * transcribed from the July / August / September 2026 calendars.
 *
 * Day 1 = 2026-07-20, Day 60 = 2026-09-17. Outside this window the regular
 * WEEKLY_TEMPLATE already produces the right plan, so only these 60 days are
 * stored as date overrides.
 *
 * `swap` is the faint "original 560 workout" to do instead when travelling.
 */
export const CHALLENGE_START = '2026-07-20'
export const CHALLENGE_TOTAL = 60

type Entry = Omit<Workout, 'challenge'> & {
  swap?: string
  levelUp?: boolean
  finale?: boolean
}

// Ordered list, day 1 → day 60.
const DAYS: Entry[] = [
  /* 01 Jul 20 */ { method: 'burn', title: 'Lower Body', swap: 'Sweaty Shredder' },
  /* 02 Jul 21 */ { method: 'burn', title: 'Upper Body', swap: 'Sculpt & Tone' },
  /* 03 Jul 22 */ { method: 'rest', title: 'recover ♡', swap: 'HIIT Pilates' },
  /* 04 Jul 23 */ { method: 'belle', title: 'Lower Body', swap: 'Sweaty Shredder' },
  /* 05 Jul 24 */ { method: 'wildcard', title: 'HIT List', levelUp: true },
  /* 06 Jul 25 */ { method: 'belle', title: 'Upper Body', swap: 'Move +10 Burner' },
  /* 07 Jul 26 */ { method: 'runclub', title: 'Run Club' },
  /* 08 Jul 27 */ { method: 'rest', title: 'recover ♡', swap: 'Sweaty Shredder' },
  /* 09 Jul 28 */ { method: 'wildcard', title: '40:400' },
  /* 10 Jul 29 */ { method: 'burn', title: 'Lower Body', swap: 'Sculpt & Tone' },
  /* 11 Jul 30 */ { method: 'burn', title: 'Upper Body', swap: 'HIIT Pilates' },
  /* 12 Jul 31 */ { method: 'belle', title: 'Lower Body', swap: 'Move' },
  /* 13 Aug 01 */ { method: 'rest', title: 'recover ♡', swap: 'Sweaty Shredder' },
  /* 14 Aug 02 */ { method: 'runclub', title: 'Run Club' },
  /* 15 Aug 03 */ { method: 'belle', title: 'Upper Body', swap: 'Sculpt & Tone', levelUp: true },
  /* 16 Aug 04 */ { method: 'wildcard', title: '18 of 18' },
  /* 17 Aug 05 */ { method: 'burn', title: 'Lower Body', swap: 'Move +10 Burner' },
  /* 18 Aug 06 */ { method: 'rest', title: 'recover ♡', swap: 'HIIT Pilates' },
  /* 19 Aug 07 */ { method: 'wildcard', title: 'HIT List' },
  /* 20 Aug 08 */ { method: 'burn', title: 'Upper Body', swap: 'Sweaty Shredder' },
  /* 21 Aug 09 */ { method: 'runclub', title: 'Run Club' },
  /* 22 Aug 10 */ { method: 'belle', title: 'Lower Body', swap: 'Sculpt & Tone' },
  /* 23 Aug 11 */ { method: 'rest', title: 'recover ♡', swap: 'HIIT Pilates' },
  /* 24 Aug 12 */ { method: 'belle', title: 'Upper Body', swap: 'Move +10 Burner' },
  /* 25 Aug 13 */ { method: 'burn', title: 'Lower Body', swap: 'Sculpt & Tone', levelUp: true },
  /* 26 Aug 14 */ { method: 'wildcard', title: 'AMRAP' },
  /* 27 Aug 15 */ { method: 'burn', title: 'Upper Body', swap: 'Sweaty Shredder' },
  /* 28 Aug 16 */ { method: 'runclub', title: 'Run Club' },
  /* 29 Aug 17 */ { method: 'rest', title: 'recover ♡', swap: 'Sculpt & Tone' },
  /* 30 Aug 18 */ { method: 'belle', title: 'Lower Body', swap: 'HIIT Pilates' },
  /* 31 Aug 19 */ { method: 'wildcard', title: 'The Grind' },
  /* 32 Aug 20 */ { method: 'belle', title: 'Upper Body', swap: 'Move' },
  /* 33 Aug 21 */ { method: 'burn', title: 'Lower Body', swap: 'Sculpt & Tone' },
  /* 34 Aug 22 */ { method: 'rest', title: 'recover ♡', swap: 'Sweaty Shredder' },
  /* 35 Aug 23 */ { method: 'runclub', title: 'Run Club', levelUp: true },
  /* 36 Aug 24 */ { method: 'burn', title: 'Upper Body', swap: 'HIIT Pilates' },
  /* 37 Aug 25 */ { method: 'wildcard', title: '18 of 18' },
  /* 38 Aug 26 */ { method: 'belle', title: 'Lower Body', swap: 'Move +15 Burner' },
  /* 39 Aug 27 */ { method: 'rest', title: 'recover ♡', swap: 'Sweaty Shredder' },
  /* 40 Aug 28 */ { method: 'belle', title: 'Upper Body', swap: 'Sculpt & Tone' },
  /* 41 Aug 29 */ { method: 'burn', title: 'Lower Body', swap: 'HIIT Pilates' },
  /* 42 Aug 30 */ { method: 'runclub', title: 'Run Club' },
  /* 43 Aug 31 */ { method: 'wildcard', title: '5 Chip Away' },
  /* 44 Sep 01 */ { method: 'rest', title: 'recover ♡', swap: 'Sweaty Shredder' },
  /* 45 Sep 02 */ { method: 'burn', title: 'Upper Body', swap: 'HIIT Pilates', levelUp: true },
  /* 46 Sep 03 */ { method: 'belle', title: 'Lower Body', swap: 'Move +10 Burner' },
  /* 47 Sep 04 */ { method: 'wildcard', title: 'AMRAP' },
  /* 48 Sep 05 */ { method: 'belle', title: 'Upper Body', swap: 'Sculpt & Tone' },
  /* 49 Sep 06 */ { method: 'runclub', title: 'Run Club' },
  /* 50 Sep 07 */ { method: 'rest', title: 'recover ♡', swap: 'HIIT Pilates' },
  /* 51 Sep 08 */ { method: 'wildcard', title: '400m' },
  /* 52 Sep 09 */ { method: 'burn', title: 'Lower Body', swap: 'Sculpt & Tone' },
  /* 53 Sep 10 */ { method: 'burn', title: 'Upper Body', swap: 'Move +15 Burner' },
  /* 54 Sep 11 */ { method: 'belle', title: 'Lower Body', swap: 'Sweaty Shredder' },
  /* 55 Sep 12 */ { method: 'wildcard', title: 'AMRAP', levelUp: true },
  /* 56 Sep 13 */ { method: 'runclub', title: 'Run Club' },
  /* 57 Sep 14 */ { method: 'rest', title: 'recover ♡', swap: 'Sculpt & Tone' },
  /* 58 Sep 15 */ { method: 'belle', title: 'Upper Body', swap: 'Sweaty Shredder' },
  /* 59 Sep 16 */ { method: 'burn', title: 'Lower Body', swap: 'HIIT Pilates' },
  /* 60 Sep 17 */ { method: 'wildcard', title: '560 Rep Challenge', finale: true },
]

/** Add days to a YYYY-MM-DD string (local, no imports to avoid a cycle). */
function shiftISO(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d + days)
  const yy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yy}-${mm}-${dd}`
}

/** ISO date → fully-formed Workout carrying its ChallengeInfo. */
export const CHALLENGE_BY_DATE: Record<string, Workout> = Object.fromEntries(
  DAYS.map((entry, i) => {
    const day = i + 1
    const iso = shiftISO(CHALLENGE_START, i)
    const { swap, levelUp, finale, ...base } = entry
    const workout: Workout = {
      ...base,
      challenge: { day, swap, levelUp, finale },
    }
    return [iso, workout]
  }),
)
