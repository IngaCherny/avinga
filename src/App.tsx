import { useState } from 'react'
import { motion } from 'framer-motion'
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
import { getWeekStart, setWeekStart, type WeekStart } from './lib/region'

export default function App() {
  const [tab, setTab] = useState<TabKey>('today')
  const tracker = useTracker()
  const weights = useWeights()
  // Which weekday the training week starts on. Held here so switching it
  // re-renders every view (the date helpers read it from the module).
  const [weekStart, setWeekStartState] = useState<WeekStart>(getWeekStart)
  const changeWeekStart = (w: WeekStart) => {
    setWeekStart(w)
    setWeekStartState(w)
  }

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

          {/*
            The entering view animates in on its own. This used to sit inside an
            <AnimatePresence mode="wait">, but switching tabs again while the old
            view was still exiting left AnimatePresence stuck on the exiting
            child: the tab bar moved while the screen underneath kept showing the
            previous tab, permanently. Dropping the exit animation makes a key
            change an ordinary unmount/mount, which cannot get stuck.
          */}
          <main className="mt-7">
            <div>
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                {tab === 'today' && <TodayView tracker={tracker} weights={weights} />}
                {tab === 'weekly' && (
                  <WeeklyView
                    tracker={tracker}
                    weights={weights}
                    weekStart={weekStart}
                    onWeekStartChange={changeWeekStart}
                  />
                )}
                {tab === 'monthly' && <MonthlyView tracker={tracker} weights={weights} />}
                {tab === 'progress' && <ProgressView weights={weights} />}
              </motion.div>
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </PasswordGate>
  )
}
