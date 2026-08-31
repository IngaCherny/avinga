import { useState } from 'react'
import type { ScheduledDay } from '../data/types'
import type { Weights } from '../lib/weights'
import WeightLogger from './WeightLogger'

interface Props {
  day: ScheduledDay
  weights: Weights
  /** 'md' for the hero, 'sm' for compact cards. */
  size?: 'sm' | 'md'
}

/** A self-contained "Log lifts" button that opens the weight logger for a day. */
export default function LogButton({ day, weights, size = 'sm' }: Props) {
  const [open, setOpen] = useState(false)
  const count = weights.loggedExercises(day.date).length
  const pad = size === 'md' ? 'px-4 py-1.5 text-xs' : 'px-2.5 py-1 text-[0.62rem]'

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation()
          setOpen(true)
        }}
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-pill border-2 border-accent/50 bg-cream-card font-body font-bold uppercase tracking-wide text-accent transition-transform hover:scale-105 active:scale-95 ${pad}`}
      >
        <span aria-hidden>🏋️</span>
        {count > 0 ? `${count} logged` : 'Log lifts'}
      </button>
      {open && <WeightLogger day={day} weights={weights} onClose={() => setOpen(false)} />}
    </>
  )
}
