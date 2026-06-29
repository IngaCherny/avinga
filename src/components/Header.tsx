import { motion } from 'framer-motion'

interface Props {
  /** First word of the title, rendered in mocha. */
  titleLead: string
  /** Second word, rendered in rose. */
  titleAccent: string
  tagline: string
  /** Pill text, e.g. the date range. */
  pill?: string
  subtitle?: string
}

/** The big two-tone display heading block from the PDF. */
export default function Header({ titleLead, titleAccent, tagline, pill, subtitle }: Props) {
  return (
    <header className="flex flex-col items-center text-center">
      <motion.p
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 font-body text-sm font-semibold tracking-wide text-rose-deep"
      >
        <span className="text-base">✷</span>
        {tagline}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className="font-display text-5xl font-bold leading-none tracking-tight sm:text-6xl"
      >
        <span className="text-mocha">{titleLead} </span>
        <span className="text-rose">{titleAccent}</span>
      </motion.h1>

      {pill && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-4 inline-flex items-center gap-2 rounded-pill bg-mocha px-5 py-2 font-body text-sm font-bold uppercase tracking-[0.12em] text-cream shadow-soft"
        >
          {pill}
        </motion.div>
      )}

      {subtitle && (
        <p className="mt-3 font-body text-sm italic text-mocha-muted">{subtitle}</p>
      )}
    </header>
  )
}
