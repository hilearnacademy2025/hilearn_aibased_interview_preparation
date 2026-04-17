import { AnimatePresence, motion as Motion } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import Footer from '../components/common/Footer'
import Header from '../components/common/Header'
import Dashboard from '../pages/Dashboard'
import Feedback from '../pages/Feedback'
import Home from '../pages/Home'
import Interview from '../pages/Interview'
import Login from '../pages/Login'
import PricingPage from '../pages/Pricing'
import ResumeUpload from '../pages/ResumeUpload'
import Signup from '../pages/Signup'

function AppShell({ children }) {
  return (
    <div className="min-h-screen">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

function AppRoutes() {
  const location = useLocation()

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
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
              <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="section-shell py-20 text-center">
                <h1 className="text-4xl font-semibold text-slate-950">Page not found</h1>
                <p className="mt-4 text-slate-600">The route you requested does not exist in this frontend build.</p>
              </Motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
    </AppShell>
  )
}

export default AppRoutes
