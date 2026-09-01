/**
 * Monochrome line icons. Every icon strokes `currentColor`, so it takes the
 * color of whatever it sits in — the app uses no multicolor icons or emoji.
 */
interface IconProps {
  className?: string
}

function Svg({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  )
}

export function DumbbellIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M6.5 8v8M3.5 10v4M17.5 8v8M20.5 10v4M6.5 12h11" />
    </Svg>
  )
}

export function LockIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="4.5" y="10.5" width="15" height="9.5" rx="2.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </Svg>
  )
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" />
    </Svg>
  )
}

export function BookIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 7.5S10 5.5 4.5 5.5v12C10 17.5 12 19.5 12 19.5s2-2 7.5-2v-12C14 5.5 12 7.5 12 7.5z" />
      <path d="M12 7.5v12" />
    </Svg>
  )
}

export function HeartIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 19.5s-7-4.2-7-9.2A3.8 3.8 0 0 1 12 7.8a3.8 3.8 0 0 1 7 2.5c0 5-7 9.2-7 9.2z" />
    </Svg>
  )
}

export function BowlIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M3.5 11.5h17a8.5 8.5 0 0 1-17 0z" />
      <path d="M8 9c0-1.6 1.8-3 4-3s4 1.4 4 3" />
    </Svg>
  )
}

export function LeafIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M19.5 4.5c0 8.5-4.8 12.5-10.5 12.5H5.5c0-8.5 4.8-12.5 10.5-12.5z" />
      <path d="M5 20c2.8-4 5.8-6.2 9.5-7.5" />
    </Svg>
  )
}

export function UtensilsIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M7 3.5v6.5M5 3.5v4a2 2 0 0 0 4 0v-4M7 10v10.5" />
      <path d="M16.5 3.5c-1.4 1.6-2 3.2-2 5.2s.9 3 2 3 2-1 2-3-.6-3.6-2-5.2zM16.5 11.7v8.8" />
    </Svg>
  )
}

export function DropletIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 3.4c3.3 3.8 5.6 6.8 5.6 9.7a5.6 5.6 0 0 1-11.2 0c0-2.9 2.3-5.9 5.6-9.7z" />
    </Svg>
  )
}

/** Icon lookup used by the program-guides list. */
export const ICONS = {
  dumbbell: DumbbellIcon,
  calendar: CalendarIcon,
  book: BookIcon,
  heart: HeartIcon,
  bowl: BowlIcon,
  leaf: LeafIcon,
  utensils: UtensilsIcon,
  droplet: DropletIcon,
} as const

export type IconKey = keyof typeof ICONS
