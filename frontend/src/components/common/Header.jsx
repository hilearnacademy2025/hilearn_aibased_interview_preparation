


// import { motion as Motion } from 'framer-motion'
// import { Link, NavLink, useLocation } from 'react-router-dom'
// import Button from './Button'
// import { useState } from 'react'

// const navLinks = [
//   { label: 'Home', to: '/' },
//   { label: 'Dashboard', to: '/dashboard' },
//   { label: 'Interview', to: '/interview' },
//   { label: 'Pricing', to: '/pricing' },
// ]

// function Header() {
//   const location = useLocation()
//   const isHome = location.pathname === '/'
//   const [hoveredLink, setHoveredLink] = useState(null)

//   const handleScroll = (id) => {
//     const element = document.getElementById(id)
//     if (element) {
//       element.scrollIntoView({ behavior: 'smooth', block: 'start' })
//     }
//   }

//   return (
//     <Motion.header
//       initial={{ y: -100, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
//       className="sticky top-4 z-50 mx-auto max-w-7xl rounded-2xl border border-blue-100/50 bg-white/90 backdrop-blur-2xl shadow-lg shadow-blue-500/10"
//     >
//       <div className="flex h-16 items-center justify-between gap-4 px-6">

//         {/* Logo Section - Modern */}
//         <Link to="/" className="flex items-center gap-3 group">
//           <Motion.div 
//             whileHover={{ scale: 1.08, rotate: 5 }}
//             whileTap={{ scale: 0.92 }}
//             transition={{ type: 'spring', stiffness: 400 }}
//             className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 text-base font-bold text-white shadow-md shadow-blue-500/40"
//           >
//             <span className="relative z-10">H</span>
//             <Motion.div
//               className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 opacity-0"
//               whileHover={{ opacity: 1 }}
//               transition={{ duration: 0.3 }}
//             />
//           </Motion.div>
//           <div className="hidden sm:block">
//             <p className="text-sm font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
//               HiLearn AI
//             </p>
//             <p className="text-[11px] text-gray-400">Interview Prep</p>
//           </div>
//         </Link>

//         {/* Navigation - Glass Morphism */}
//         <nav className="hidden items-center gap-1 rounded-full border border-blue-100/50 bg-white/40 px-2 py-1 backdrop-blur-md lg:flex">
//           {navLinks.map((item) => (
//             <NavLink
//               key={item.to}
//               to={item.to}
//               onMouseEnter={() => setHoveredLink(item.to)}
//               onMouseLeave={() => setHoveredLink(null)}
//               className={({ isActive }) =>
//                 `relative rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 ${
//                   isActive 
//                     ? 'text-blue-600' 
//                     : 'text-gray-600 hover:text-blue-600'
//                 }`
//               }
//             >
//               {({ isActive }) => (
//                 <>
//                   {item.label}
//                   {(isActive || hoveredLink === item.to) && (
//                     <Motion.div
//                       layoutId="activeNav"
//                       className="absolute inset-0 rounded-full bg-blue-50 -z-10"
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       transition={{ type: 'spring', stiffness: 500, damping: 30 }}
//                     />
//                   )}
//                 </>
//               )}
//             </NavLink>
//           ))}
//           {isHome && (
//             <>
//               <button 
//                 className="relative rounded-full px-4 py-1.5 text-sm font-medium text-gray-600 transition-all duration-300 hover:text-blue-600"
//                 onClick={() => handleScroll('features')}
//                 onMouseEnter={() => setHoveredLink('features')}
//                 onMouseLeave={() => setHoveredLink(null)}
//               >
//                 Features
//                 {hoveredLink === 'features' && (
//                   <Motion.div
//                     layoutId="activeNav"
//                     className="absolute inset-0 rounded-full bg-blue-50 -z-10"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ type: 'spring', stiffness: 500, damping: 30 }}
//                   />
//                 )}
//               </button>
//               <button 
//                 className="relative rounded-full px-4 py-1.5 text-sm font-medium text-gray-600 transition-all duration-300 hover:text-blue-600"
//                 onClick={() => handleScroll('testimonials')}
//                 onMouseEnter={() => setHoveredLink('stories')}
//                 onMouseLeave={() => setHoveredLink(null)}
//               >
//                 Stories
//                 {hoveredLink === 'stories' && (
//                   <Motion.div
//                     layoutId="activeNav"
//                     className="absolute inset-0 rounded-full bg-blue-50 -z-10"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ type: 'spring', stiffness: 500, damping: 30 }}
//                   />
//                 )}
//               </button>
//             </>
//           )}
//         </nav>

//         {/* Auth Buttons */}
//         <div className="flex items-center gap-3">
//           <Motion.div
//             whileHover={{ x: -3 }}
//             transition={{ type: 'spring', stiffness: 400 }}
//           >
//             <Link 
//               to="/login" 
//               className="hidden text-sm font-medium text-gray-600 transition-all duration-200 hover:text-blue-600 md:inline"
//             >
//               Sign in
//             </Link>
//           </Motion.div>
//           <Button variant="primary" className="px-5 py-2 text-sm rounded-xl shadow-md shadow-blue-500/25">
//             Start Free
//           </Button>
//         </div>
//       </div>
//     </Motion.header>
//   )
// }

// export default Header




// import { motion as Motion } from 'framer-motion'
// import { Link, NavLink, useLocation } from 'react-router-dom'
// import Button from './Button'
// import { useState } from 'react'

// const navLinks = [
//   { label: 'Home', to: '/' },
//   { label: 'Dashboard', to: '/dashboard' },
//   { label: 'Interview', to: '/interview' },
//   { label: 'Pricing', to: '/pricing' },
// ]

// function Header() {
//   const location = useLocation()
//   const isHome = location.pathname === '/'
//   const [hoveredLink, setHoveredLink] = useState(null)

//   const handleScroll = (id) => {
//     const element = document.getElementById(id)
//     if (element) {
//       element.scrollIntoView({ behavior: 'smooth', block: 'start' })
//     }
//   }

//   return (
//     <Motion.header
//       initial={{ y: -100, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
//       className="sticky top-0 z-50 bg-white border-b border-blue-100 shadow-sm"  // ✅ Solid white, no blur, no transparency
//     >
//       <div className="max-w-7xl mx-auto flex h-16 items-center justify-between gap-4 px-6">

//         {/* Logo Section */}
//         <Link to="/" className="flex items-center gap-3 group">
//           <Motion.div 
//             whileHover={{ scale: 1.08, rotate: 5 }}
//             whileTap={{ scale: 0.92 }}
//             transition={{ type: 'spring', stiffness: 400 }}
//             className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 text-base font-bold text-white shadow-md shadow-blue-500/40"
//           >
//             <span className="relative z-10">H</span>
//           </Motion.div>
//           <div className="hidden sm:block">
//             <p className="text-sm font-bold text-gray-900">HiLearn AI</p>
//             <p className="text-[11px] text-gray-500">Interview Prep</p>
//           </div>
//         </Link>

//         {/* Navigation - Solid */}
//         <nav className="hidden items-center gap-1 lg:flex">
//           {navLinks.map((item) => (
//             <NavLink
//               key={item.to}
//               to={item.to}
//               onMouseEnter={() => setHoveredLink(item.to)}
//               onMouseLeave={() => setHoveredLink(null)}
//               className={({ isActive }) =>
//                 `relative rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 ${
//                   isActive 
//                     ? 'text-blue-600 bg-blue-50' 
//                     : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
//                 }`
//               }
//             >
//               {({ isActive }) => (
//                 <>
//                   {item.label}
//                   {(isActive || hoveredLink === item.to) && (
//                     <Motion.div
//                       layoutId="activeNav"
//                       className="absolute inset-0 rounded-full bg-blue-50 -z-10"
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       transition={{ type: 'spring', stiffness: 500, damping: 30 }}
//                     />
//                   )}
//                 </>
//               )}
//             </NavLink>
//           ))}
//           {isHome && (
//             <>
//               <button 
//                 className="relative rounded-full px-4 py-1.5 text-sm font-medium text-gray-600 transition-all duration-300 hover:text-blue-600 hover:bg-blue-50"
//                 onClick={() => handleScroll('features')}
//                 onMouseEnter={() => setHoveredLink('features')}
//                 onMouseLeave={() => setHoveredLink(null)}
//               >
//                 Features
//               </button>
//               <button 
//                 className="relative rounded-full px-4 py-1.5 text-sm font-medium text-gray-600 transition-all duration-300 hover:text-blue-600 hover:bg-blue-50"
//                 onClick={() => handleScroll('testimonials')}
//                 onMouseEnter={() => setHoveredLink('stories')}
//                 onMouseLeave={() => setHoveredLink(null)}
//               >
//                 Stories
//               </button>
//             </>
//           )}
//         </nav>

//         {/* Auth Buttons */}
//         <div className="flex items-center gap-3">
//           <Link 
//             to="/login" 
//             className="hidden text-sm font-medium text-gray-600 transition-all duration-200 hover:text-blue-600 md:inline"
//           >
//             Sign in
//           </Link>
//           <Button variant="primary" className="px-5 py-2 text-sm rounded-xl">
//             Start Free
//           </Button>
//         </div>
//       </div>
//     </Motion.header>
//   )
// }

// export default Header


// import { motion as Motion } from 'framer-motion'
// import { Link, NavLink, useLocation } from 'react-router-dom'
// import Button from './Button'
// import { useState, useEffect } from 'react'

// const navLinks = [
//   { label: 'Home', to: '/' },
//   { label: 'Dashboard', to: '/dashboard' },
//   { label: 'Interview', to: '/interview' },
//   { label: 'Resume', to: '/resume' },
//   { label: 'Pricing', to: '/pricing' },
// ]

// function Header() {
//   const location = useLocation()
//   const isHome = location.pathname === '/'
//   const [hoveredLink, setHoveredLink] = useState(null)

//   // Scroll to top when page changes
//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: 'instant' })
//   }, [location.pathname])

//   const handleScroll = (id) => {
//     const element = document.getElementById(id)
//     if (element) {
//       element.scrollIntoView({ behavior: 'smooth', block: 'start' })
//     }
//   }

//   return (
//     <Motion.header
//       initial={{ y: -100, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
//       className="sticky top-0 z-50 bg-white border-b border-blue-100 shadow-sm"
//     >
//       <div className="max-w-7xl mx-auto flex h-20 items-center justify-between gap-4 px-6">

//         {/* Logo Section - Thoda bada */}
//         <Link to="/" className="flex items-center gap-3 group">
//           <Motion.div 
//             whileHover={{ scale: 1.08, rotate: 5 }}
//             whileTap={{ scale: 0.92 }}
//             transition={{ type: 'spring', stiffness: 400 }}
//             className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 text-base font-bold text-white shadow-md shadow-blue-500/40"
//           >
//             <span className="relative z-10">H</span>
//           </Motion.div>
//           <div className="hidden sm:block">
//             <p className="text-base font-bold text-gray-900">HiLearn AI</p>
//             <p className="text-xs text-gray-500">Interview Prep</p>
//           </div>
//         </Link>

//         {/* Navigation - Less rounded, bigger */}
//        <nav className="hidden items-center gap-1 lg:flex">
//   {navLinks.map((item) => (
//     <NavLink
//       key={item.to}
//       to={item.to}
//       onMouseEnter={() => setHoveredLink(item.to)}
//       onMouseLeave={() => setHoveredLink(null)}
//       className={({ isActive }) =>
//         `rounded-lg px-5 py-2 text-sm font-medium transition-all duration-200 ${
//           isActive 
//             ? 'bg-blue-600 !text-white shadow-md shadow-blue-500/30' 
//             : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
//         }`
//       }
//     >
//       {item.label}
//     </NavLink>
//   ))}
//   {isHome && (
//     <>
//       <button 
//         className="rounded-lg px-5 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:text-blue-600 hover:bg-blue-50"
//         onClick={() => handleScroll('features')}
//         onMouseEnter={() => setHoveredLink('features')}
//         onMouseLeave={() => setHoveredLink(null)}
//       >
//         Features
//       </button>
//       <button 
//         className="rounded-lg px-5 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:text-blue-600 hover:bg-blue-50"
//         onClick={() => handleScroll('testimonials')}
//         onMouseEnter={() => setHoveredLink('stories')}
//         onMouseLeave={() => setHoveredLink(null)}
//       >
//         Stories
//       </button>
//     </>
//   )}
// </nav>

//         {/* Auth Buttons */}
//         <div className="flex items-center gap-4">
//           <Link 
//             to="/login" 
//             className="hidden text-sm font-medium text-gray-600 transition-all duration-200 hover:text-blue-600 md:inline"
//           >
//             Sign in
//           </Link>
//           <Button variant="primary" className="px-5 py-2.5 text-sm cursor-pointer rounded-lg">
//             Start Free
//           </Button>
//         </div>
//       </div>
//     </Motion.header>
//   )
// }

// export default Header



import { motion as Motion } from 'framer-motion'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Button from './Button'
import { useState, useEffect } from 'react'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Interview', to: '/interview' },
  { label: 'Resume', to: '/resume' },
  { label: 'Pricing', to: '/pricing' },
]

function Header() {
  const location = useLocation()
  const [hoveredLink, setHoveredLink] = useState(null)
  const [scrolled, setScrolled] = useState(false)

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <Motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      className={`sticky top-0 z-50 bg-white transition-all duration-300 ${scrolled
          ? 'border-b border-blue-100 shadow-lg shadow-blue-500/5'
          : 'border-b border-blue-50'
        }`}
    >
      <div className="max-w-7xl mx-auto flex h-24 items-center justify-between gap-6 px-8">

        {/* Logo Section - Bigger */}
        <Link to="/" className="flex items-center gap-4 group">
          <Motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400 }}
            className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 text-2xl font-bold text-white shadow-lg shadow-blue-500/40"
          >
            <span className="relative z-10">H</span>
          </Motion.div>
          <div className="hidden sm:block">
            <p className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              HiLearn AI
            </p>
            <p className="text-sm text-gray-800 tracking-wide">Interview Preparation Platform</p>
          </div>
        </Link>

        {/* Navigation - Bigger */}
        <nav className="hidden items-center gap-2 lg:flex">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onMouseEnter={() => setHoveredLink(item.to)}
              onMouseLeave={() => setHoveredLink(null)}
              className={({ isActive }) =>
                `rounded-lg px-6 py-2.5 text-base font-medium transition-all duration-200 ${isActive
                  ? 'bg-blue-600 !text-white shadow-md shadow-blue-500/30'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Auth Buttons - Bigger */}
        <div className="flex items-center gap-5">
          <Motion.div
            whileHover={{ x: -3 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <Link
              to="/login"
              className="hidden text-base font-medium text-gray-600 transition-all duration-200 hover:text-blue-600 md:inline"
            >
              Sign in
            </Link>
          </Motion.div>
          <Button
            variant="primary"
            className="px-5 py-2.5 text-base cursor-pointer rounded-lg"
          >
            Start Free
          </Button>
        </div>
      </div>
    </Motion.header>
  )
}

export default Header