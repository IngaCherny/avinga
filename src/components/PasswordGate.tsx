import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Background from './Background'
import { checkPassword, isUnlocked, rememberUnlocked } from '../lib/auth'
import { LockIcon } from './icons'

/**
 * Wraps the app in a password screen. Once unlocked on a device it's remembered,
 * so you only type the password the first time (and after clearing site data).
 */
export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false)
  const [ready, setReady] = useState(false)
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    setUnlocked(isUnlocked())
    setReady(true)
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!value.trim() || checking) return
    setChecking(true)
    setError(false)
    const ok = await checkPassword(value.trim())
    setChecking(false)
    if (ok) {
      rememberUnlocked()
      setUnlocked(true)
    } else {
      setError(true)
      setValue('')
    }
  }

  // Avoid a flash of the lock screen before we've read the unlock flag.
  if (!ready) return null
  if (unlocked) return <>{children}</>

  return (
    <div className="relative grid min-h-dvh place-items-center px-5">
      <Background />
      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 160, damping: 18 }}
        className="relative w-full max-w-sm rounded-card bg-cream-card p-7 text-center shadow-card sm:p-8"
      >
        <LockIcon className="mx-auto h-9 w-9 text-mocha-soft" />
        <h1 className="mt-3 font-display text-3xl font-bold leading-none tracking-tight">
          <span className="text-mocha">LIIFT </span>
          <span className="text-accent">MORE</span>
        </h1>
        <p className="mt-2 font-body text-sm italic text-mocha-muted">
          this space is private — enter the password to lift
        </p>

        <input
          type="password"
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setError(false)
          }}
          placeholder="password"
          aria-label="Password"
          autoComplete="current-password"
          className={`mt-5 w-full rounded-pill border-2 bg-cream px-5 py-3 text-center font-body text-base text-mocha outline-none transition-colors ${
            error ? 'border-rose-deep' : 'border-cream-deep focus:border-accent'
          }`}
        />

        {error && (
          <p className="mt-2 font-body text-sm font-semibold text-rose-deep">
            Not quite — try again.
          </p>
        )}

        <button
          type="submit"
          disabled={checking}
          className="mt-4 w-full rounded-pill bg-mocha px-5 py-3 font-body text-sm font-bold uppercase tracking-[0.12em] text-cream shadow-pill transition-transform active:scale-95 disabled:opacity-60"
        >
          {checking ? 'Checking…' : 'Unlock'}
        </button>
      </motion.form>
    </div>
  )
}
