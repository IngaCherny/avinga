import type { WeekStart } from '../lib/region'

interface Props {
  value: WeekStart
  onChange: (w: WeekStart) => void
}

const OPTIONS: { value: WeekStart; label: string; hint: string }[] = [
  { value: 0, label: 'Sun–Thu', hint: 'Lift Sunday to Thursday, rest Fri & Sat' },
  { value: 1, label: 'Mon–Fri', hint: 'Lift Monday to Friday, rest Sat & Sun' },
]

/** Pick which weekday the training week starts on (auto-detected by timezone). */
export default function WeekShapeToggle({ value, onChange }: Props) {
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="font-body text-[0.65rem] font-bold uppercase tracking-[0.12em] text-mocha-muted">
        my week
      </span>
      <div className="flex items-center gap-1 rounded-pill bg-cream-card/80 p-1 shadow-soft">
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            aria-pressed={value === o.value}
            title={o.hint}
            className={`rounded-pill px-3 py-1 font-body text-xs font-bold transition-colors ${
              value === o.value ? 'bg-mocha text-cream shadow-pill' : 'text-mocha-muted'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}
