import { WEEKDAY_BADGE } from '../data/schedule'

interface Props {
  weekday: number
  label: string
  size?: 'md' | 'lg'
}

/** The round colored badge showing SUN / MON / … */
export default function DayBadge({ weekday, label, size = 'md' }: Props) {
  const color = WEEKDAY_BADGE[weekday] ?? WEEKDAY_BADGE[0]
  const dim = size === 'lg' ? 'h-16 w-16 text-sm' : 'h-12 w-12 text-[0.7rem]'
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-body font-bold tracking-[0.08em] shadow-soft ${dim} ${color.bg} ${color.text}`}
    >
      {label}
    </span>
  )
}
