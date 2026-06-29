import { motion } from 'framer-motion'

interface Props {
  done: number
  total: number
  size?: number
}

/** Circular progress indicator for the week's completed workouts. */
export default function ProgressRing({ done, total, size = 64 }: Props) {
  const stroke = 7
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = total > 0 ? done / total : 0

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-cream-deep"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          className="text-belle"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={{ type: 'spring', stiffness: 90, damping: 18 }}
        />
      </svg>
      <span className="absolute font-display text-sm font-bold text-mocha">
        {done}/{total}
      </span>
    </div>
  )
}
