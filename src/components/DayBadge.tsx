import { METHODS } from '../data/schedule'
import type { MethodKey } from '../data/types'

interface Props {
  /** The day's method — drives the badge color so it matches the workout tag. */
  method: MethodKey
  label: string
  size?: 'md' | 'lg'
}

/** The round colored badge showing SUN / MON / …, tinted to the day's method. */
export default function DayBadge({ method, label, size = 'md' }: Props) {
  const meta = METHODS[method]
  const dim = size === 'lg' ? 'h-16 w-16 text-sm' : 'h-12 w-12 text-[0.7rem]'
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-body font-bold tracking-[0.08em] shadow-soft ${dim} ${meta.pillClass} ${meta.pillTextClass}`}
    >
      {label}
    </span>
  )
}
