import { useRef, useState } from 'react'
import type { Weights } from '../lib/weights'

/**
 * Backup and restore the on-device weight log. Your numbers live only in this
 * browser — this is how you move them between devices or keep a safe copy.
 */
export default function DataCard({ weights }: { weights: Weights }) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function download() {
    const stamp = new Date().toISOString().slice(0, 10)
    const url = URL.createObjectURL(new Blob([weights.exportJSON()], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `liift-more-weights-${stamp}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMsg({ ok: true, text: 'Backup downloaded.' })
  }

  function load(raw: string) {
    try {
      const { days, sets } = weights.importJSON(raw)
      setMsg({ ok: true, text: `Imported ${days} day${days === 1 ? '' : 's'} · ${sets} sets.` })
      setText('')
    } catch {
      setMsg({ ok: false, text: "That doesn't look like a LIIFT MORE backup." })
    }
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) file.text().then(load)
    e.target.value = ''
  }

  return (
    <div className="overflow-hidden rounded-card bg-cream-card/80 shadow-soft">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span>
          <span className="font-body text-[0.6rem] font-bold uppercase tracking-[0.18em] text-mocha-muted">
            your data
          </span>
          <span className="mt-0.5 block font-display text-base font-semibold text-mocha">
            Backup &amp; restore
          </span>
        </span>
        <span className={`text-mocha-muted transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {open && (
        <div className="px-5 pb-5">
          <p className="font-body text-xs leading-snug text-mocha-soft">
            Your weights are saved only on this device — never uploaded, never shared with anyone
            else using the app. Keep a backup, or move them to another phone.
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={download}
              className="rounded-pill bg-mocha px-4 py-2 font-body text-sm font-bold text-cream shadow-pill transition-transform active:scale-95"
            >
              ↓ Download backup
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="rounded-pill bg-cream px-4 py-2 font-body text-sm font-bold text-mocha shadow-soft transition-transform active:scale-95"
            >
              ↑ Restore from file
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              onChange={onFile}
              className="hidden"
            />
          </div>

          <label className="mt-4 block font-body text-[0.62rem] font-bold uppercase tracking-wide text-mocha-muted">
            …or paste a backup
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder='{ "2026-09-21": { "Flat Bench Press": [{ "weight": 5, "reps": 12 }] } }'
            className="mt-1 w-full rounded-2xl border border-cream-deep bg-cream p-3 font-mono text-[0.68rem] text-mocha outline-none focus:border-accent"
          />
          <button
            onClick={() => text.trim() && load(text)}
            className="mt-1 rounded-pill bg-cream px-4 py-2 font-body text-sm font-bold text-mocha shadow-soft"
          >
            Import pasted
          </button>

          {msg && (
            <p
              className={`mt-3 font-body text-sm font-semibold ${
                msg.ok ? 'text-back' : 'text-rose-deep'
              }`}
            >
              {msg.text}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
