import { AnimatePresence, motion } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import AnimatedBackground from '../components/common/AnimatedBackground'
import CommandPalette from '../components/common/CommandPalette'
import CustomCursor from '../components/common/CustomCursor'
import Footer from '../components/common/Footer'
import Header from '../components/common/Header'
import ScrollToTop from '../components/common/ScrollToTop'
import ToastProvider from '../components/common/ToastProvider'
import About from '../pages/About'
import Dashboard from '../pages/Dashboard'
import Features from '../pages/Features'
import Feedback from '../pages/Feedback'
import Home from '../pages/Home'
import Interview from '../pages/Interview'
import Login from '../pages/Login'
import PricingPage from '../pages/Pricing'
import ResumeUpload from '../pages/ResumeUpload'
import Signup from '../pages/Signup'

function AppShell({ children }) {
  return (
    <ToastProvider>
      <div className="relative min-h-screen">
        <AnimatedBackground />
        <CustomCursor />
        <ScrollToTop />
        <CommandPalette />
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </ToastProvider>
  )
}

function AppRoutes() {
  const location = useLocation()

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/resume" element={<ResumeUpload />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="*"
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="section-shell py-24"
              >
                <div className="surface-card mx-auto max-w-2xl px-8 py-16 text-center">
                  <p className="text-sm uppercase tracking-[0.24em] text-[#c8601a]">Not found</p>
                  <h1 className="display-font mt-4 text-5xl font-bold text-[#0f1f3d]">This route slipped off the map.</h1>
                  <p className="mt-4 text-[#5c5a57]">Try the navigation above or press Ctrl/Cmd + K to jump to a page.</p>
                </div>
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
    </AppShell>
  )
}

export default AppRoutes
