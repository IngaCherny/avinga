import { motion } from 'framer-motion'

interface Props {
  done: boolean
  onToggle: () => void
  /** rest days get a dashed, non-interactive ring */
  rest?: boolean
  label: string
}

/** The right-hand completion toggle, empty ring → filled check. */
export default function CheckCircle({ done, onToggle, rest, label }: Props) {
  if (rest) {
    return (
      <span
        aria-hidden
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-dashed border-mocha-muted/50"
      />
    )
  }

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileTap={{ scale: 0.85 }}
      aria-pressed={done}
      aria-label={done ? `Mark ${label} not done` : `Mark ${label} done`}
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 transition-colors duration-200 ${
        done
          ? 'border-belle bg-belle text-white'
          : 'border-mocha-muted/40 bg-transparent text-transparent hover:border-belle/70'
      }`}
    >
      <motion.svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        initial={false}
        animate={{ scale: done ? 1 : 0, opacity: done ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 22 }}
      >
        <path
          d="M5 12.5l4.2 4.2L19 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
    </motion.button>
  )
}
