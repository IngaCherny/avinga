import { motion } from 'framer-motion'

export type TabKey = 'today' | 'weekly' | 'monthly' | 'progress'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'progress', label: 'Progress' },
]

interface Props {
  active: TabKey
  onChange: (key: TabKey) => void
}

/** Segmented control with an animated sliding pill. */
export default function Tabs({ active, onChange }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Views"
      className="mx-auto flex w-full max-w-md items-center gap-1 rounded-pill bg-cream-card/80 p-1.5 shadow-soft backdrop-blur"
    >
      {TABS.map((tab) => {
        const isActive = tab.key === active
        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className="relative flex-1 rounded-pill px-2 py-2 font-body text-[0.8rem] font-bold transition-colors sm:px-3 sm:text-sm"
          >
            {isActive && (
              <motion.span
                layoutId="tab-pill"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className="absolute inset-0 rounded-pill bg-mocha shadow-pill"
              />
            )}
            <span
              className={`relative z-10 ${isActive ? 'text-cream' : 'text-mocha-muted'}`}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
