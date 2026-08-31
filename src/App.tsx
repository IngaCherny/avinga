import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Background from './components/Background'
import PasswordGate from './components/PasswordGate'
import Tabs, { type TabKey } from './components/Tabs'
import TodayView from './components/TodayView'
import WeeklyView from './components/WeeklyView'
import MonthlyView from './components/MonthlyView'
import ProgressView from './components/ProgressView'
import Footer from './components/Footer'
import { useTracker } from './lib/storage'
import { useWeights } from './lib/weights'

export default function App() {
  const [tab, setTab] = useState<TabKey>('today')
  const tracker = useTracker()
  const weights = useWeights()

  return (
    <PasswordGate>
      <div className="relative min-h-dvh">
        <Background />

        <div className="relative mx-auto flex max-w-2xl flex-col px-4 pt-6 sm:px-6 sm:pt-10">
          {/* brand */}
          <div className="mb-6 flex items-center justify-center">
            <span className="font-display text-xl font-bold tracking-tight">
              <span className="text-mocha">LIIFT </span>
              <span className="text-accent">MORE</span>
            </span>
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
                {tab === 'today' && <TodayView tracker={tracker} weights={weights} />}
                {tab === 'weekly' && <WeeklyView tracker={tracker} weights={weights} />}
                {tab === 'monthly' && <MonthlyView tracker={tracker} weights={weights} />}
                {tab === 'progress' && <ProgressView weights={weights} />}
              </motion.div>
            </AnimatePresence>
          </main>

          <Footer />
        </div>
      </div>
    </PasswordGate>
  )
}
