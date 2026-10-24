/**
 * The official LIIFT MORE program materials in your Google Drive.
 *
 * Only the labels live here. The Drive IDs are NOT in this file and not in the
 * repository at all — the source is public, so anything in it is readable by
 * anyone. Each device holds its own copy of the links (see lib/links.ts); a
 * guide whose link is missing is simply not shown.
 */
import type { IconKey } from '../components/icons'

export interface Resource {
  /** Stable key used to look the Drive id up in the device's link bundle. */
  key: string
  label: string
  detail: string
  kind: 'file' | 'folder'
  icon: IconKey
}

export const RESOURCES: Resource[] = [
  {
    key: 'weight-progression',
    label: 'Weight Progression',
    detail: 'The official sheet — 3 sets per exercise, all 8 weeks',
    kind: 'file',
    icon: 'dumbbell',
  },
  {
    key: 'workout-calendar',
    label: 'Workout Calendar',
    detail: 'The full 8-week day-by-day calendar',
    kind: 'file',
    icon: 'calendar',
  },
  {
    key: 'get-started',
    label: 'Get Started Guide',
    detail: 'Equipment, form and how the program works',
    kind: 'file',
    icon: 'book',
  },
  {
    key: 'recovery-workouts',
    label: 'Recovery Workouts',
    detail: 'For your rest days',
    kind: 'folder',
    icon: 'heart',
  },
  {
    key: 'nutrition-guide',
    label: 'Nutrition Guide',
    detail: 'Quick start nutrition',
    kind: 'file',
    icon: 'bowl',
  },
  {
    key: 'gut-protocol',
    label: '4 Week Gut Protocol',
    detail: 'How to run it alongside LIIFT MORE',
    kind: 'file',
    icon: 'leaf',
  },
  {
    key: 'portion-fix',
    label: 'Portion Fix',
    detail: 'Eating plan & recipes',
    kind: 'folder',
    icon: 'utensils',
  },
  {
    key: '2b-mindset',
    label: '2B Mindset',
    detail: 'Eating plan & recipes',
    kind: 'folder',
    icon: 'droplet',
  },
]
