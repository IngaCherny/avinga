import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { CHALLENGE_BY_DATE } from '../data/challenge'
import { dateLabel, parseISO } from '../lib/dates'
import {
  clearPrivateChallenge,
  parseImported,
  privateDayCount,
  savePrivateChallenge,
} from '../lib/privateChallenge'

/** Ordered day list (1→60) with date + generic title, for the template. */
const DAYS = Object.entries(CHALLENGE_BY_DATE)
  .map(([iso, w]) => ({ iso, day: w.challenge!.day, title: w.title }))
  .sort((a, b) => a.day - b.day)

/** Build a starter JSON keyed by day number, with a human label + blank fields. */
function templateJSON(): string {
  const obj: Record<string, unknown> = {}
  for (const d of DAYS) {
    obj[d.day] = {
      label: `Day ${d.day} · ${dateLabel(parseISO(d.iso))} · ${d.title}`,
      link: '',
      note: '',
    }
  }
  return JSON.stringify(obj, null, 2)
}

function download(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }))
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
}

export default function PrivateImport({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState('')
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const loaded = privateDayCount()

  function doImport(raw: string) {
    try {
      const parsed = parseImported(JSON.parse(raw))
      const count = Object.keys(parsed).length
      if (count === 0) {
        setMsg({ ok: false, text: 'No valid days found. Each day needs a link, note, or title.' })
        return
      }
      savePrivateChallenge(parsed)
      setMsg({ ok: true, text: `Imported ${count} day${count === 1 ? '' : 's'}. Reloading…` })
      setTimeout(() => window.location.reload(), 700)
    } catch {
      setMsg({ ok: false, text: 'That doesn’t look like valid JSON. Check the file and try again.' })
    }
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    file.text().then(doImport)
  }

  function doClear() {
    clearPrivateChallenge()
    setMsg({ ok: true, text: 'Cleared. Reloading…' })
    setTimeout(() => window.location.reload(), 500)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-mocha/30 px-3 py-6 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[88vh] w-full max-w-md overflow-y-auto rounded-card bg-cream-card p-6 shadow-card"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-xl font-bold text-mocha">Private 560 plan</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-full bg-cream text-mocha-soft shadow-soft"
          >
            ✕
          </button>
        </div>

        <p className="mt-2 font-body text-sm leading-snug text-mocha-soft">
          The purchased 560 workout links &amp; notes live only on this device — never uploaded.
          Import your private file to see them on the challenge days.
          {loaded > 0 && (
            <span className="mt-1 block font-semibold text-belle">{loaded} days loaded</span>
          )}
        </p>

        <ol className="mt-4 space-y-1 font-body text-xs text-mocha-muted">
          <li>1. Download the template and fill in each day’s link / note.</li>
          <li>2. Keep the file in your own iCloud / Files (not in the app).</li>
          <li>3. Import it here — repeat once on each device.</li>
        </ol>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => download('sweaty-560-template.json', templateJSON())}
            className="rounded-pill bg-cream px-4 py-2 font-body text-sm font-bold text-mocha shadow-soft transition-transform active:scale-95"
          >
            ↓ Template
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="rounded-pill bg-belle px-4 py-2 font-body text-sm font-bold text-white shadow-pill transition-transform active:scale-95"
          >
            ⬆ Import file
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            onChange={onFile}
            className="hidden"
          />
        </div>

        <div className="mt-4">
          <label className="font-body text-xs font-bold uppercase tracking-wide text-mocha-muted">
            …or paste JSON
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder='{ "1": { "link": "https://…", "note": "3 rounds" } }'
            className="mt-1 w-full rounded-2xl border border-cream-deep bg-cream p-3 font-mono text-xs text-mocha outline-none focus:border-belle"
          />
          <div className="mt-2 flex items-center justify-between">
            <button
              onClick={() => text.trim() && doImport(text)}
              className="rounded-pill bg-mocha px-4 py-2 font-body text-sm font-bold text-cream shadow-pill transition-transform active:scale-95"
            >
              Import pasted
            </button>
            {loaded > 0 && (
              <button
                onClick={doClear}
                className="font-body text-xs font-semibold text-rose-deep underline"
              >
                Clear private data
              </button>
            )}
          </div>
        </div>

        {msg && (
          <p
            className={`mt-3 font-body text-sm font-semibold ${
              msg.ok ? 'text-belle' : 'text-rose-deep'
            }`}
          >
            {msg.text}
          </p>
        )}
      </motion.div>
    </div>
  )
}
