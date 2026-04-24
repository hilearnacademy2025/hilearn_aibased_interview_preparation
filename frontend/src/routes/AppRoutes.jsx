// import { AnimatePresence, motion } from 'framer-motion'
// import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'
// import AnimatedBackground from '../components/common/AnimatedBackground'
// import CommandPalette from '../components/common/CommandPalette'
// import CustomCursor from '../components/common/CustomCursor'
// import Footer from '../components/common/Footer'
// import Header from '../components/common/Header'
// import ScrollToTop from '../components/common/ScrollToTop'
// import ToastProvider from '../components/common/ToastProvider'

// import AdminLayout from '../layouts/AdminLayout'
// import UserLayout from '../layouts/UserLayout'

// import About from '../pages/About'
// import Features from '../pages/Features'
// import Dashboard from '../pages/Dashboard'
// import Interview from '../pages/Interview'
// import Home from '../pages/Home'
// import Login from '../pages/Login'
// import PricingPage from '../pages/Pricing'
// import Signup from '../pages/Signup'

// import AdminDashboard from '../pages/admin/AdminDashboard'
// import AdminUsers from '../pages/admin/AdminUsers'
// import AdminInterviews from '../pages/admin/AdminInterviews'
// import AdminAnalytics from '../pages/admin/AdminAnalytics'
// import AdminSettings from '../pages/admin/AdminSettings'

// import UserDashboard from '../pages/user/UserDashboard'
// import UserInterviewSetup from '../pages/user/UserInterviewSetup'
// import UserInterview from '../pages/user/UserInterview'
// import UserAnalytics from '../pages/user/UserAnalytics'
// import UserFeedback from '../pages/user/UserFeedback'
// import UserSettings from '../pages/user/UserSettings'
// // import ResumeUpload from '../pages/ResumeUpload'

// function Spinner() {
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-[#f4f2ee]">
//       <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#c8601a]/30 border-t-[#c8601a]" />
//     </div>
//   )
// }

// function RequireAdmin({ children }) {
//   const { isAuthenticated, isAdmin, loading } = useAuth()
//   if (loading) return <Spinner />
//   if (!isAuthenticated) return <Navigate to="/login" replace />
//   if (!isAdmin) return <Navigate to="/user" replace />
//   return children
// }

// function RequireUser({ children }) {
//   const { isAuthenticated, loading } = useAuth()
//   if (loading) return <Spinner />
//   if (!isAuthenticated) return <Navigate to="/login" replace />
//   return children
// }

// function PublicShell({ children }) {
//   return (
//     <div className="relative min-h-screen">
//       <AnimatedBackground />
//       <CustomCursor />
//       <ScrollToTop />
//       <CommandPalette />
//       <Header />
//       <main>{children}</main>
//       <Footer />
//     </div>
//   )
// }

// export default function AppRoutes() {
//   const location = useLocation()
//   return (
//     <ToastProvider>
//       <AnimatePresence mode="wait">
//         <Routes location={location} key={location.pathname}>

//           {/* ── Public ── */}
//           <Route path="/" element={<PublicShell><Home /></PublicShell>} />
//           <Route path="/features" element={<PublicShell><Features /></PublicShell>} />
//           <Route path="/dashboard" element={<PublicShell><Dashboard /></PublicShell>} />
//           <Route path="/interview" element={<PublicShell><Interview /></PublicShell>} />
//           <Route path="/about" element={<PublicShell><About /></PublicShell>} />
//           <Route path="/pricing" element={<PublicShell><PricingPage /></PublicShell>} />
//           <Route path="/login" element={<PublicShell><Login /></PublicShell>} />
//           <Route path="/signup" element={<PublicShell><Signup /></PublicShell>} />

//           {/* ── Admin ── */}
//           <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
//             <Route index element={<AdminDashboard />} />
//             <Route path="users" element={<AdminUsers />} />
//             <Route path="interviews" element={<AdminInterviews />} />
//             <Route path="analytics" element={<AdminAnalytics />} />
//             <Route path="settings" element={<AdminSettings />} />
//           </Route>

//           {/* ── User ── */}
//           <Route path="/user" element={<RequireUser><UserLayout /></RequireUser>}>
//             <Route index element={<UserDashboard />} />
//             <Route path="interview-setup" element={<UserInterviewSetup />} />
//             <Route path="interview" element={<UserInterview />} />
//             <Route path="analytics" element={<UserAnalytics />} />
//             <Route path="feedback" element={<UserFeedback />} />
//             <Route path="settings" element={<UserSettings />} />
//             {/* <Route path="resume-upload" element={<ResumeUpload />} /> */}
//           </Route>

//           {/* ── 404 ── */}
//           <Route path="*" element={
//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-shell py-24">
//               <div className="surface-card mx-auto max-w-2xl px-8 py-16 text-center">
//                 <p className="text-sm uppercase tracking-[0.24em] text-[#c8601a]">Not found</p>
//                 <h1 className="display-font mt-4 text-5xl font-bold text-[#0f1f3d]">This route slipped off the map.</h1>
//                 <p className="mt-4 text-[#5c5a57]">Try the navigation above or press Ctrl/Cmd + K to jump to a page.</p>
//               </div>
//             </motion.div>
//           } />
//         </Routes>
//       </AnimatePresence>
//     </ToastProvider>
//   )
// }



// import { AnimatePresence, motion } from 'framer-motion'
// import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'
// import AnimatedBackground from '../components/common/AnimatedBackground'
// import CommandPalette from '../components/common/CommandPalette'
// import CustomCursor from '../components/common/CustomCursor'
// import Footer from '../components/common/Footer'
// import Header from '../components/common/Header'
// import ScrollToTop from '../components/common/ScrollToTop'
// import ToastProvider from '../components/common/ToastProvider'

// import AdminLayout from '../layouts/AdminLayout'
// import UserLayout from '../layouts/UserLayout'

// import About from '../pages/About'
// import Features from '../pages/Features'
// import Home from '../pages/Home'
// import Login from '../pages/Login'
// import PricingPage from '../pages/Pricing'
// import Interview from '../pages/Interview'
// import Signup from '../pages/Signup'

// import AdminDashboard from '../pages/admin/AdminDashboard'
// import AdminUsers from '../pages/admin/AdminUsers'
// import AdminInterviews from '../pages/admin/AdminInterviews'
// import AdminAnalytics from '../pages/admin/AdminAnalytics'
// import AdminSettings from '../pages/admin/AdminSettings'

// import UserDashboard from '../pages/user/UserDashboard'
// import UserInterviewSetup from '../pages/user/UserInterviewSetup'
// import UserInterview from '../pages/user/UserInterview'
// import UserAnalytics from '../pages/user/UserAnalytics'
// import UserFeedback from '../pages/user/UserFeedback'
// import UserSettings from '../pages/user/UserSettings'

// // Smooth fade - no jhatka
// const pageVariants = {
//   initial: { opacity: 0, y: 12 },
//   animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] } },
//   exit: { opacity: 0, y: -8, transition: { duration: 0.18, ease: [0.4, 0, 0.2, 1] } },
// }

// function PageWrap({ children }) {
//   return (
//     <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
//       {children}
//     </motion.div>
//   )
// }

// function Spinner() {
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-[#f4f2ee]">
//       <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#c8601a]/30 border-t-[#c8601a]" />
//     </div>
//   )
// }

// function RequireAdmin({ children }) {
//   const { isAuthenticated, isAdmin, loading } = useAuth()
//   if (loading) return <Spinner />
//   if (!isAuthenticated) return <Navigate to="/login" replace />
//   if (!isAdmin) return <Navigate to="/user" replace />
//   return children
// }

// function RequireUser({ children }) {
//   const { isAuthenticated, loading } = useAuth()
//   if (loading) return <Spinner />
//   if (!isAuthenticated) return <Navigate to="/login" replace />
//   return children
// }

// // Public layout - Header/Footer fixed, sirf content animate hota hai
// function PublicContent() {
//   const location = useLocation()
//   return (
//     <AnimatePresence mode="wait">
//       <Routes location={location} key={location.pathname}>
//         <Route path="/" element={<PageWrap><Home /></PageWrap>} />
//         <Route path="/features" element={<PageWrap><Features /></PageWrap>} />
//         <Route path="/about" element={<PageWrap><About /></PageWrap>} />
//         <Route path="/pricing" element={<PageWrap><PricingPage /></PageWrap>} />
//         <Route path="/interview" element={<PageWrap><Interview /></PageWrap>} />
//         <Route path="/login" element={<PageWrap><Login /></PageWrap>} />
//         <Route path="/signup" element={<PageWrap><Signup /></PageWrap>} />
//         <Route path="*" element={
//           <PageWrap>
//             <div className="section-shell py-24">
//               <div className="surface-card mx-auto max-w-2xl px-8 py-16 text-center">
//                 <p className="text-sm uppercase tracking-[0.24em] text-[#c8601a]">Not found</p>
//                 <h1 className="display-font mt-4 text-5xl font-bold text-[#0f1f3d]">This route slipped off the map.</h1>
//                 <p className="mt-4 text-[#5c5a57]">Try the navigation above or press Ctrl/Cmd + K to jump to a page.</p>
//               </div>
//             </div>
//           </PageWrap>
//         } />
//       </Routes>
//     </AnimatePresence>
//   )
// }

// function PublicShell() {
//   return (
//     <div className="relative min-h-screen">
//       <AnimatedBackground />
//       <CustomCursor />
//       <ScrollToTop />
//       <CommandPalette />
//       <Header />
//       <main><PublicContent /></main>
//       <Footer />
//     </div>
//   )
// }

// export default function AppRoutes() {
//   const location = useLocation()
//   const isAdmin = location.pathname.startsWith('/admin')
//   const isUser = location.pathname.startsWith('/user')

//   if (isAdmin) {
//     return (
//       <ToastProvider>
//         <Routes>
//           <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
//             <Route index element={<AdminDashboard />} />
//             <Route path="users" element={<AdminUsers />} />
//             <Route path="interviews" element={<AdminInterviews />} />
//             <Route path="analytics" element={<AdminAnalytics />} />
//             <Route path="settings" element={<AdminSettings />} />
//           </Route>
//         </Routes>
//       </ToastProvider>
//     )
//   }

//   if (isUser) {
//     return (
//       <ToastProvider>
//         <Routes>
//           <Route path="/user" element={<RequireUser><UserLayout /></RequireUser>}>
//             <Route index element={<UserDashboard />} />
//             <Route path="interview-setup" element={<UserInterviewSetup />} />
//             <Route path="interview" element={<UserInterview />} />
//             <Route path="analytics" element={<UserAnalytics />} />
//             <Route path="feedback" element={<UserFeedback />} />
//             <Route path="settings" element={<UserSettings />} />
//           </Route>
//         </Routes>
//       </ToastProvider>
//     )
//   }

//   return (
//     <ToastProvider>
//       <PublicShell />
//     </ToastProvider>
//   )
// }


import { AnimatePresence, motion } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AnimatedBackground from '../components/common/AnimatedBackground'
import CommandPalette from '../components/common/CommandPalette'
import CustomCursor from '../components/common/CustomCursor'
import Footer from '../components/common/Footer'
import Header from '../components/common/Header'
import ScrollToTop from '../components/common/ScrollToTop'
import ToastProvider from '../components/common/ToastProvider'

import AdminLayout from '../layouts/AdminLayout'
import UserLayout from '../layouts/UserLayout'

import About from '../pages/About'
import Features from '../pages/Features'
import Home from '../pages/Home'
import Login from '../pages/Login'
import PricingPage from '../pages/Pricing'
import Checkout from '../pages/Checkout'
import Interview from '../pages/Interview'
import Signup from '../pages/Signup'

import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminUsers from '../pages/admin/AdminUsers'
import AdminInterviews from '../pages/admin/AdminInterviews'
import AdminAnalytics from '../pages/admin/AdminAnalytics'
import AdminSettings from '../pages/admin/AdminSettings'
import AdminLeaderboard from '../pages/admin/AdminLeaderboard'

import UserDashboard from '../pages/user/UserDashboard'
import UserInterviewSetup from '../pages/user/UserInterviewSetup'
import UserInterview from '../pages/user/UserInterview'
import UserAnalytics from '../pages/user/UserAnalytics'
import UserFeedback from '../pages/user/UserFeedback'
import UserSettings from '../pages/user/UserSettings'
import UserMCQInterview from '../pages/user/UserMCQInterview'
import MCQResults from '../pages/user/MCQResults'
import Leaderboard from '../pages/user/Leaderboard'

// Smooth fade - no jhatka
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18, ease: [0.4, 0, 0.2, 1] } },
}

function PageWrap({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  )
}

function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f4f2ee]">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#c8601a]/30 border-t-[#c8601a]" />
    </div>
  )
}

function RequireAdmin({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  if (loading) return <Spinner />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/user" replace />
  return children
}

function RequireUser({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <Spinner />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

// Public layout - Header/Footer fixed, sirf content animate hota hai
function PublicContent() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrap><Home /></PageWrap>} />
        <Route path="/features" element={<PageWrap><Features /></PageWrap>} />
        <Route path="/about" element={<PageWrap><About /></PageWrap>} />
        <Route path="/pricing" element={<PageWrap><PricingPage /></PageWrap>} />
        <Route path="/checkout" element={<PageWrap><Checkout /></PageWrap>} />
        <Route path="/interview" element={<PageWrap><Interview /></PageWrap>} />
        <Route path="/login" element={<PageWrap><Login /></PageWrap>} />
        <Route path="/signup" element={<PageWrap><Signup /></PageWrap>} />
        <Route path="*" element={
          <PageWrap>
            <div className="section-shell py-24">
              <div className="surface-card mx-auto max-w-2xl px-8 py-16 text-center">
                <p className="text-sm uppercase tracking-[0.24em] text-[#c8601a]">Not found</p>
                <h1 className="display-font mt-4 text-5xl font-bold text-[#0f1f3d]">This route slipped off the map.</h1>
                <p className="mt-4 text-[#5c5a57]">Try the navigation above or press Ctrl/Cmd + K to jump to a page.</p>
              </div>
            </div>
          </PageWrap>
        } />
      </Routes>
    </AnimatePresence>
  )
}

function PublicShell() {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <CustomCursor />
      <ScrollToTop />
      <CommandPalette />
      <Header />
      <main><PublicContent /></main>
      <Footer />
    </div>
  )
}

export default function AppRoutes() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const isUser = location.pathname.startsWith('/user')

  if (isAdmin) {
    return (
      <ToastProvider>
        <Routes>
          <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="interviews" element={<AdminInterviews />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="leaderboard" element={<AdminLeaderboard />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </ToastProvider>
    )
  }

  if (isUser) {
    return (
      <ToastProvider>
        <Routes>
          <Route path="/user" element={<RequireUser><UserLayout /></RequireUser>}>
            <Route index element={<UserDashboard />} />
            <Route path="interview-setup" element={<UserInterviewSetup />} />
            <Route path="interview" element={<UserInterview />} />
            <Route path="analytics" element={<UserAnalytics />} />
            <Route path="feedback" element={<UserFeedback />} />
            <Route path="settings" element={<UserSettings />} />
            <Route path="mcq-interview" element={<UserMCQInterview />} />
            <Route path="mcq-results" element={<MCQResults />} />
            <Route path="leaderboard" element={<Leaderboard />} />
          </Route>
        </Routes>
      </ToastProvider>
    )
  }

  return (
    <ToastProvider>
      <PublicShell />
    </ToastProvider>
  )
}