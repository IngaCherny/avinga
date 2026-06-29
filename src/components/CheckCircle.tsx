import { useState } from 'react'
import { motion } from 'framer-motion'
import Confetti from './Confetti'

interface Props {
  done: boolean
  onToggle: () => void
  /** rest days get a dashed, non-interactive ring */
  rest?: boolean
  label: string
}

/** The right-hand completion toggle, empty ring to filled check. */
export default function CheckCircle({ done, onToggle, rest, label }: Props) {
  const [burst, setBurst] = useState(false)

  const handleClick = () => {
    if (!done) {
      setBurst(true)
      window.setTimeout(() => setBurst(false), 750)
    }
    onToggle()
  }

  // Rest days are checkable too (mark "rested" to keep your streak going),
  // shown with a dashed ring until checked.
  const idle = rest
    ? 'border-dashed border-mocha-muted/50 bg-transparent text-transparent hover:border-belle/70'
    : 'border-mocha-muted/40 bg-transparent text-transparent hover:border-belle/70'

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileTap={{ scale: 0.85 }}
      aria-pressed={done}
      aria-label={done ? `Mark ${label} not done` : `Mark ${label} done`}
      className={`relative grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 transition-colors duration-200 ${
        done ? 'border-belle bg-belle text-white' : idle
      }`}
    >
      {burst && <Confetti />}
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
