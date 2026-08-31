/**
 * Suggested exercises for each LIIFT MORE workout day, keyed by the workout
 * title. These pre-fill the weight logger so you can just punch in numbers — but
 * you can always add your own moves. Based on the program's superset structure
 * (typically 3 sets × 12 reps).
 */
export const SUGGESTED_EXERCISES: Record<string, string[]> = {
  'Chest & Biceps': [
    'Chest Press',
    'Chest Fly',
    'Incline Press',
    'Rotating Press',
    'Bicep Curl',
    'Hammer Curl',
    'Wide Curl',
  ],
  'Quads & Calves': [
    'Goblet Squat',
    'Squat',
    'Reverse Lunge',
    'Step-Up',
    'Sumo Squat',
    'Calf Raise',
  ],
  'Back & Triceps': [
    'Bent-Over Row',
    'Renegade Row',
    'Pullover',
    'Reverse Fly',
    'Triceps Extension',
    'Triceps Kickback',
    'Close-Grip Press',
  ],
  'Hamstrings & Glutes': [
    'Romanian Deadlift',
    'Hip Thrust',
    'Glute Bridge',
    'Curtsy Lunge',
    'Sumo Deadlift',
    'Good Morning',
    'Calf Raise',
  ],
  Shoulders: [
    'Overhead Press',
    'Arnold Press',
    'Lateral Raise',
    'Front Raise',
    'Upright Row',
    'Rear Delt Fly',
  ],
}

/** Suggested exercises for a day's workout title (empty for rest / unknown). */
export function suggestedFor(title: string): string[] {
  return SUGGESTED_EXERCISES[title] ?? []
}
