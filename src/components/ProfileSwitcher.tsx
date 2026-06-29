import { motion } from 'framer-motion'
import { PEOPLE } from '../data/people'

interface Props {
  active: string
  onChange: (id: string) => void
}

/** Pick whose progress you're viewing — Inga or Aviv. */
export default function ProfileSwitcher({ active, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="hidden font-body text-xs font-semibold uppercase tracking-[0.12em] text-mocha-muted sm:inline">
        tracking as
      </span>
      <div className="flex items-center gap-1 rounded-pill bg-cream-card/80 p-1 shadow-soft backdrop-blur">
        {PEOPLE.map((p) => {
          const isActive = p.id === active
          return (
            <button
              key={p.id}
              onClick={() => onChange(p.id)}
              aria-pressed={isActive}
              className="relative flex items-center gap-1.5 rounded-pill px-2.5 py-1.5 font-body text-sm font-bold transition-colors"
            >
              {isActive && (
                <motion.span
                  layoutId="profile-pill"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  className="absolute inset-0 rounded-pill bg-mocha shadow-pill"
                />
              )}
              <span
                className={`relative z-10 grid h-6 w-6 place-items-center rounded-full text-xs ${p.avatarClass}`}
              >
                {p.initial}
              </span>
              <span className={`relative z-10 ${isActive ? 'text-cream' : 'text-mocha-muted'}`}>
                {p.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
