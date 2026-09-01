/**
 * The official LIIFT MORE exercise list, transcribed from the program's
 * "Weight Progression" tracking sheet (Beachbody, 2022). The sheet records
 * 3 sets per exercise for each of the 8 weeks — which is exactly how the
 * weight logger is set up.
 */

const CHEST = [
  'Flat Bench Press',
  'Flat Bench Fly',
  'Flat Bench Rotating Press',
  'Flat Bench Neutral Press',
  'Incline Bench Press',
  'Incline Bench Fly',
  'Incline Bench Rotating Press',
  'Incline Bench Neutral Press',
]

const BACK = [
  'Bent Over Row',
  'Flat Bench Single Row (R&L)',
  'Incline Bench Supinated Single Row (R&L)',
  'Reverse Fly (seated or standing)',
  'Wide Raise (seated or standing)',
  'Flat Bench Pullover',
]

const SHOULDERS = [
  'Seated Overhead Press',
  'Seated Arm Opener',
  'Seated Lateral Raise',
  'Standing High Row',
  'Standing Upright Row',
  'Seated Front Raise',
  'Seated Reverse Raise',
  'Seated Trap Rotation',
  'Standing Trap Opener',
]

const BICEPS = [
  'Supine Curl (seated or standing)',
  'Hammer Curl (seated or standing)',
  'Wide Curl (seated or standing)',
  'Seated Iso Curl (R&L)',
  'Standing Rotating Curl',
]

const TRICEPS = [
  'Skull Crusher',
  'Iso-Crusher (R&L)',
  'Triceps Press',
  'Kickback (seated or standing)',
]

const QUADS = [
  'Hanging Squat',
  'Front Loaded Narrow Squat',
  'Benched Step Up (R&L)',
  'Static Lunge (R&L)',
  'Side Lunge (R&L)',
  'Bulgarian Split Squat (R&L)',
]

const HAMS_GLUTES = [
  'Stiff-Legged Deadlift',
  'Wide Leg Deadlift',
  'Single-Leg Deadlift (R&L)',
  'Sumo Squat',
  'Alt Stepping Front Lunge',
  'Bridge (feet on bench)',
  'Benched Hip Thruster (back on bench)',
  'Frog Bridge',
]

const CALVES = [
  'Calf Raise',
  'Pigeon Calf Raise',
  'Duck Calf Raise',
  'Single-Leg Calf Raise (R&L)',
]

/** The exercise pool for each workout title, keyed exactly as the schedule names them. */
export const SUGGESTED_EXERCISES: Record<string, string[]> = {
  // Phase 1 (weeks 1-4)
  'Chest & Biceps': [...CHEST, ...BICEPS],
  'Quads & Calves': [...QUADS, ...CALVES],
  'Back & Triceps': [...BACK, ...TRICEPS],
  'Hamstrings & Glutes': [...HAMS_GLUTES],
  Shoulders: [...SHOULDERS],
  // Phase 2 (weeks 5-8)
  'Chest & Back': [...CHEST, ...BACK],
  Legs: [...QUADS, ...CALVES],
  'More Legs': [...HAMS_GLUTES, ...CALVES],
  Arms: [...BICEPS, ...TRICEPS],
}

/** The program's prescribed sets per exercise. */
export const DEFAULT_SETS = 3
/** The program's typical rep target. */
export const DEFAULT_REPS = 12

/** Official exercises for a day's workout title (empty for rest / unknown). */
export function suggestedFor(title: string): string[] {
  return SUGGESTED_EXERCISES[title] ?? []
}
