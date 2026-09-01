/**
 * The official LIIFT MORE program materials in your Google Drive. These open in
 * a new tab (Drive handles access), so they stay out of the public build.
 */
export interface Resource {
  label: string
  detail: string
  url: string
  icon: string
}

const file = (id: string) => `https://drive.google.com/file/d/${id}/view`
const folder = (id: string) => `https://drive.google.com/drive/folders/${id}`

export const RESOURCES: Resource[] = [
  {
    label: 'Weight Progression',
    detail: 'The official sheet — 3 sets per exercise, all 8 weeks',
    url: file('1pktLwOvobQXNnM0gkgeHC13p_t4cXsKq'),
    icon: '🏋️',
  },
  {
    label: 'Workout Calendar',
    detail: 'The full 8-week day-by-day calendar',
    url: file('13IZ2c_CH1nDxPvGpN2gD_Yxo8R6V9ktp'),
    icon: '📅',
  },
  {
    label: 'Get Started Guide',
    detail: 'Equipment, form and how the program works',
    url: file('1z5Gy62CXzZYvHqdlI5skx0nQZhbsiXq8'),
    icon: '📗',
  },
  {
    label: 'Recovery Workouts',
    detail: 'For your rest days',
    url: folder('1ZSh7PX0aiWvJyhs38U2w-v8gm2wC7-XP'),
    icon: '🧘',
  },
  {
    label: 'Nutrition Guide',
    detail: 'Quick start nutrition',
    url: file('16c7y0YlaWRj9gY1Rz5BV1Pdz0DcHSZlg'),
    icon: '🥗',
  },
  {
    label: '4 Week Gut Protocol',
    detail: 'How to run it alongside LIIFT MORE',
    url: file('1XicGQvEj9W05AjVnJWbVp0Ur4SS7joNs'),
    icon: '🌱',
  },
  {
    label: 'Portion Fix',
    detail: 'Eating plan & recipes',
    url: folder('1LQ-skKTG6WHbmNJCnVfzw-FXtiTn3lZQ'),
    icon: '🍽️',
  },
  {
    label: '2B Mindset',
    detail: 'Eating plan & recipes',
    url: folder('1QtcsshRv9MjYvNNUz4Hr2gWS5JCHWOvb'),
    icon: '💧',
  },
]
