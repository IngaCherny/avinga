import { useRef, useState } from 'react'
import { clearLinks, counts, exportLinks, importLinks, useLinks } from '../lib/links'
import { PROGRAM_TOTAL } from '../data/schedule'
import { RESOURCES } from '../data/resources'
import { LockIcon } from './icons'

/** 40 lifting days across the 8 weeks (5 per week). */
const LIFT_DAYS = Math.round((PROGRAM_TOTAL / 7) * 5)

/**
 * Paste in your Drive links. They're kept on this device only — the app's code
 * is public, so the video and guide IDs deliberately aren't in it.
 */
export default function LinksCard() {
  useLinks()
  const { videos, resources, folder } = counts()
  const [paste, setPaste] = useState('')
  const [note, setNote] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  const linked = videos > 0 || resources > 0 || folder

  function load(text: string) {
    try {
      const n = importLinks(text)
      setError(null)
      setNote(`Linked ${n.videos} video${n.videos === 1 ? '' : 's'} and ${n.resources} guide${n.resources === 1 ? '' : 's'}.`)
      setPaste('')
    } catch (e) {
      setNote(null)
      setError(e instanceof Error ? e.message : 'that text was not a link bundle')
    }
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    f.text().then(load)
    e.target.value = ''
  }

  function copyOut() {
    navigator.clipboard?.writeText(exportLinks()).then(
      () => { setError(null); setNote('Copied — paste it into the other device.') },
      () => setError('could not reach the clipboard'),
    )
  }

  return (
    <div className="rounded-card bg-cream-card p-5 shadow-soft">
      <div className="flex items-start gap-2.5">
        <LockIcon className="mt-0.5 h-4 w-4 shrink-0 text-mocha-muted" />
        <div className="min-w-0">
          <p className="font-display text-base font-semibold text-mocha">Your Drive links</p>
          <p className="mt-1 font-body text-xs leading-relaxed text-mocha-soft">
            Kept on this device only. The app's code is public, so the video links
            aren't stored in it — paste them in once here and they stay in this browser.
          </p>
        </div>
      </div>

      <p className="mt-3 font-body text-xs font-semibold text-mocha-muted">
        {linked ? (
          <>
            <strong className="text-mocha">{videos}</strong> of {LIFT_DAYS} workouts ·{' '}
            <strong className="text-mocha">{resources}</strong> of {RESOURCES.length} guides
            {folder && ' · folder set'}
          </>
        ) : (
          'Nothing linked yet — Watch buttons stay hidden until you add them.'
        )}
      </p>

      <textarea
        value={paste}
        onChange={(e) => setPaste(e.target.value)}
        placeholder="paste your links here…"
        rows={3}
        className="mt-3 w-full resize-y rounded-2xl border border-cream-deep bg-cream px-3 py-2 font-body text-xs text-mocha outline-none focus:border-accent"
      />

      <div className="mt-2 flex flex-wrap gap-2">
        <button
          onClick={() => load(paste)}
          disabled={!paste.trim()}
          className="rounded-pill bg-mocha px-4 py-2 font-body text-xs font-bold text-cream shadow-pill transition-transform active:scale-95 disabled:opacity-40"
        >
          Save links
        </button>
        <button
          onClick={() => fileInput.current?.click()}
          className="rounded-pill bg-cream px-4 py-2 font-body text-xs font-bold text-mocha shadow-soft"
        >
          From file
        </button>
        {linked && (
          <>
            <button
              onClick={copyOut}
              className="rounded-pill bg-cream px-4 py-2 font-body text-xs font-bold text-mocha shadow-soft"
            >
              Copy for another device
            </button>
            <button
              onClick={() => {
                if (confirming) { clearLinks(); setConfirming(false); setNote('Links cleared from this device.'); setError(null) }
                else setConfirming(true)
              }}
              onBlur={() => setConfirming(false)}
              className="rounded-pill px-3 py-2 font-body text-xs font-bold text-mocha-muted"
            >
              {confirming ? 'Tap again to clear' : 'Clear'}
            </button>
          </>
        )}
        <input ref={fileInput} type="file" accept="application/json,.json,.txt" onChange={onFile} className="hidden" />
      </div>

      {note && <p className="mt-2 font-body text-xs font-semibold text-back">{note}</p>}
      {error && <p className="mt-2 font-body text-xs font-semibold text-chest">{error}</p>}
    </div>
  )
}
