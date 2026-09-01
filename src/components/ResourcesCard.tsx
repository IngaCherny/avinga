import { useState } from 'react'
import { motion } from 'framer-motion'
import { RESOURCES } from '../data/resources'

/** Collapsible list of the official program guides in Drive. */
export default function ResourcesCard() {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-card bg-cream-card/80 shadow-soft"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span>
          <span className="font-body text-[0.6rem] font-bold uppercase tracking-[0.18em] text-mocha-muted">
            program guides
          </span>
          <span className="mt-0.5 block font-display text-base font-semibold text-mocha">
            Calendar, weight sheet &amp; more
          </span>
        </span>
        <span className={`text-mocha-muted transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {open && (
        <div className="grid gap-2 px-4 pb-4 sm:grid-cols-2">
          {RESOURCES.map((r) => (
            <a
              key={r.label}
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-2.5 rounded-2xl bg-cream/70 px-3 py-2.5 transition-transform hover:scale-[1.02]"
            >
              <span aria-hidden className="text-base leading-none">{r.icon}</span>
              <span className="min-w-0">
                <span className="block font-body text-sm font-bold text-mocha">{r.label}</span>
                <span className="block font-body text-[0.68rem] leading-snug text-mocha-muted">
                  {r.detail}
                </span>
              </span>
            </a>
          ))}
        </div>
      )}
    </motion.div>
  )
}
