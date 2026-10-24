import { useState } from 'react'
import { motion } from 'framer-motion'
import { RESOURCES } from '../data/resources'
import { resourceUrl, useLinks } from '../lib/links'
import { ICONS } from './icons'

/**
 * Collapsible list of the official program guides in Drive. The links live on
 * this device (lib/links.ts), so only the guides that have been linked show up
 * — and the whole card hides when none have.
 */
export default function ResourcesCard() {
  const [open, setOpen] = useState(false)
  useLinks() // re-render when links are added or cleared

  const available = RESOURCES.map((r) => ({ ...r, url: resourceUrl(r.key, r.kind) })).filter(
    (r): r is typeof r & { url: string } => Boolean(r.url),
  )
  if (available.length === 0) return null

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
          {available.map((r) => {
            const Icon = ICONS[r.icon]
            return (
            <a
              key={r.label}
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-2.5 rounded-2xl bg-cream/70 px-3 py-2.5 transition-transform hover:scale-[1.02]"
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-mocha-soft" />
              <span className="min-w-0">
                <span className="block font-body text-sm font-bold text-mocha">{r.label}</span>
                <span className="block font-body text-[0.68rem] leading-snug text-mocha-muted">
                  {r.detail}
                </span>
              </span>
            </a>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
