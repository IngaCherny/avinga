import { motion } from 'framer-motion'
import { hasLinks, useLinks } from '../lib/links'
import { LockIcon } from './icons'

/**
 * Shown until this device has its Drive links. Without them there are no Watch
 * buttons anywhere, which on its own just looks like the app is broken — so say
 * what is missing and where to fix it.
 */
export default function NeedLinksCard() {
  useLinks()
  if (hasLinks()) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-card bg-cream-card/80 p-4 shadow-soft"
    >
      <div className="flex items-start gap-2.5">
        <LockIcon className="mt-0.5 h-4 w-4 shrink-0 text-mocha-muted" />
        <div className="min-w-0">
          <p className="font-display text-sm font-semibold text-mocha">
            Add your videos to this device
          </p>
          <p className="mt-1 font-body text-xs leading-relaxed text-mocha-soft">
            Your Drive links aren’t stored in the app’s code, so Watch buttons stay
            hidden until you paste them in — once per device. Go to{' '}
            <strong className="text-accent">Progress → Your Drive links</strong>.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
