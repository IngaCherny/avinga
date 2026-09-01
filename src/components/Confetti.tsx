import { motion } from 'framer-motion'

// Monochrome: the app's accent only, at varying opacity.
const COLORS = ['#CB5A45']
const PIECES = 11

/** A quick celebratory burst, centered on its relatively-positioned parent. */
export default function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center">
      {Array.from({ length: PIECES }).map((_, i) => {
        const angle = (i / PIECES) * Math.PI * 2
        const dist = 22 + (i % 3) * 9
        const x = Math.cos(angle) * dist
        const y = Math.sin(angle) * dist
        return (
          <motion.span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: COLORS[i % COLORS.length] }}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{ opacity: 0, x, y, scale: 0.5 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        )
      })}
    </div>
  )
}
