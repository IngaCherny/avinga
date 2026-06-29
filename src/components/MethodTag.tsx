import { METHODS } from '../data/schedule'
import type { MethodKey } from '../data/types'

export default function MethodTag({ method }: { method: MethodKey }) {
  const meta = METHODS[method]
  return (
    <span
      className={`inline-flex items-center rounded-pill px-3 py-1 font-body text-[0.62rem] font-bold uppercase tracking-[0.12em] shadow-pill ${meta.pillClass} ${meta.pillTextClass}`}
    >
      {meta.label}
    </span>
  )
}
