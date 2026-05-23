import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

function App() {
  const location = useLocation()
  return (
    <AnimatePresence mode="sync">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen"
      >
        <AppRoutes />
      </motion.div>
    </AnimatePresence>
  )
}

export default App
