import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Background from './components/Background'
import Tabs, { type TabKey } from './components/Tabs'
import ProfileSwitcher from './components/ProfileSwitcher'
import TodayView from './components/TodayView'
import WeeklyView from './components/WeeklyView'
import MonthlyView from './components/MonthlyView'
import Footer from './components/Footer'
import PrivateImport from './components/PrivateImport'
import { useTracker } from './lib/storage'

export default function App() {
  const [tab, setTab] = useState<TabKey>('today')
  const [showPrivate, setShowPrivate] = useState(false)
  const tracker = useTracker()

  return (
    <div className="relative min-h-dvh">
      <Background />

      <div className="relative mx-auto flex max-w-2xl flex-col px-4 pt-6 sm:px-6 sm:pt-10">
        {/* brand + profile row */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-bold tracking-tight text-mocha">
              Sweaty Week
            </span>
            <button
              onClick={() => setShowPrivate(true)}
              aria-label="Private 560 plan"
              title="Private 560 plan"
              className="grid h-6 w-6 place-items-center rounded-full text-xs text-mocha-muted/70 transition-colors hover:bg-cream-card hover:text-mocha"
            >
              🔒
            </button>
          </div>
          <ProfileSwitcher active={tracker.activePerson} onChange={tracker.setActivePerson} />
        </div>

        <Tabs active={tab} onChange={setTab} />

        <main className="mt-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {tab === 'today' && <TodayView tracker={tracker} />}
              {tab === 'weekly' && <WeeklyView tracker={tracker} />}
              {tab === 'monthly' && <MonthlyView tracker={tracker} />}
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />
      </div>

      {showPrivate && <PrivateImport onClose={() => setShowPrivate(false)} />}
    </div>
  )
}
