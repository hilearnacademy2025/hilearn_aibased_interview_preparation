

// import { useEffect, useMemo, useState } from 'react'
// import { motion as Motion } from 'framer-motion'
// import Loader from '../components/common/Loader'
// import Button from '../components/common/Button'
// import { getSession, healthCheck } from '../utils/api'
// import { Link } from 'react-router-dom'

// const fallbackHistory = [
//   { title: 'Frontend Developer', type: 'technical', score: 8.4, status: 'Completed' },
//   { title: 'Product Analyst', type: 'behavioral', score: 7.8, status: 'Completed' },
// ]

// function Dashboard() {
//   const [loading, setLoading] = useState(true)
//   const [status, setStatus] = useState(null)
//   const [sessionData, setSessionData] = useState(null)
//   const [sessionError, setSessionError] = useState('')
//   const [hoveredStat, setHoveredStat] = useState(null)
//   const [hoveredHistory, setHoveredHistory] = useState(null)

//   useEffect(() => {
//     const loadDashboard = async () => {
//       setLoading(true)
//       try {
//         const [health, storedSessionId] = await Promise.all([
//           healthCheck(),
//           Promise.resolve(window.localStorage.getItem('hilearn_session_id')),
//         ])
//         setStatus(health)

//         if (storedSessionId) {
//           try {
//             const session = await getSession(storedSessionId)
//             setSessionData(session.data)
//           } catch (error) {
//             setSessionError(error.message)
//           }
//         }
//       } finally {
//         setLoading(false)
//       }
//     }

//     loadDashboard()
//   }, [])

//   const computedStats = useMemo(() => {
//     const latestScore = Number(window.localStorage.getItem('hilearn_latest_score') || '8.2')
//     return [
//       { label: 'Latest score', value: `${latestScore.toFixed(1)}/10`, icon: '🎯' },
//       { label: 'Sessions tracked', value: sessionData ? `${sessionData.answers_count || 0}+` : '2', icon: '📊' },
//       { label: 'Active systems', value: status ? Object.values(status.services).filter((value) => value === 'healthy').length : '1', icon: '⚡' },
//     ]
//   }, [sessionData, status])

//   if (loading) {
//     return <Loader label="Preparing your dashboard..." />
//   }

//   return (
//     <Motion.div
//       initial={{ opacity: 0, y: 14 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="min-h-screen bg-gray-50 py-14 px-4"
//     >
//       <div className="max-w-7xl mx-auto">
        
//         {/* Hero Banner */}
//         <Motion.div
//           initial={{ opacity: 0, scale: 0.98 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.5 }}
//           className="mb-8 rounded-2xl bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 p-8 text-white shadow-xl shadow-blue-500/30"
//         >
//           <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
//             <div>
//               <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-100">
//                 Dashboard overview
//               </p>
//               <h1 className="mt-3 text-4xl font-bold tracking-tight">
//                 A focused view of your practice momentum.
//               </h1>
//               <p className="mt-4 max-w-2xl text-base leading-7 text-blue-100">
//                 Track scores, session progress, and backend status in one cleaner surface built to feel professional and easy to scan.
//               </p>
//             </div>
//             <div className="rounded-xl bg-white/15 px-5 py-4 backdrop-blur-sm">
//               <p className="text-sm text-blue-100">Latest score</p>
//               <p className="mt-1 text-3xl font-bold">{computedStats[0].value}</p>
//             </div>
//           </div>
//         </Motion.div>

//         <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          
//           {/* Left Section */}
//           <div className="space-y-6">
            
//             {/* Performance Snapshot */}
//             <Motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 }}
//               className="rounded-2xl border border-blue-100 bg-white p-8 shadow-lg shadow-blue-100/40"
//             >
//               <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
//                 <div>
//                   <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
//                     Performance snapshot
//                   </p>
//                   <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
//                     Progress that feels motivating.
//                   </h2>
//                   <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
//                     A student-friendly dashboard for checking readiness, recent interview signals, and backend connectivity.
//                   </p>
//                 </div>
//                 <Link to="/interview">
//                   <Button variant="primary" className="px-6 cursor-pointer py-2.5">
//                     Start another round →
//                   </Button>
//                 </Link>
//               </div>

//               {/* Stats Cards */}
//               <div className="mt-8 grid gap-4 md:grid-cols-3">
//                 {computedStats.map((item, idx) => (
//                   <Motion.div
//                     key={item.label}
//                     onMouseEnter={() => setHoveredStat(idx)}
//                     onMouseLeave={() => setHoveredStat(null)}
//                     whileHover={{ y: -5, scale: 1.02 }}
//                     className="relative rounded-xl border border-blue-100 bg-white p-5 shadow-md shadow-blue-100/30 cursor-pointer transition-all duration-300"
//                   >
//                     <Motion.div
//                       animate={{
//                         scale: hoveredStat === idx ? [1, 1.2, 1] : 1,
//                       }}
//                       transition={{ duration: 0.3 }}
//                       className="text-2xl mb-2"
//                     >
//                       {item.icon}
//                     </Motion.div>
//                     <p className="text-sm text-gray-500">{item.label}</p>
//                     <p className="mt-1 text-3xl font-bold text-gray-900">{item.value}</p>
//                     {hoveredStat === idx && (
//                       <Motion.div
//                         layoutId="statGlow"
//                         className="absolute inset-0 rounded-xl bg-blue-50/50 -z-10"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                       />
//                     )}
//                   </Motion.div>
//                 ))}
//               </div>

//               {/* Confidence Chart */}
//               <div className="mt-8 rounded-xl bg-gray-900 p-6 shadow-lg">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm uppercase tracking-[0.24em] text-gray-400">
//                       Communication trend
//                     </p>
//                     <h2 className="mt-2 text-2xl font-bold text-white">
//                       Confidence growth over recent sessions
//                     </h2>
//                   </div>
//                   <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
//                     +18% this week
//                   </span>
//                 </div>
//                 <div className="mt-8 flex items-end gap-4">
//                   {[56, 64, 72, 81, 88].map((height, index) => (
//                     <div key={height} className="flex-1">
//                       <Motion.div
//                         initial={{ height: 0 }}
//                         animate={{ height: `${height}%` }}
//                         transition={{ duration: 0.5, delay: index * 0.1 }}
//                         className="rounded-t-xl bg-gradient-to-t from-blue-500 to-blue-400"
//                         style={{ height: `${height}%`, minHeight: '72px' }}
//                       />
//                       <p className="mt-3 text-center text-xs text-gray-400">W{index + 1}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </Motion.div>
//           </div>

//           {/* Right Section */}
//           <div className="space-y-6">
            
//             {/* Interview History */}
//             <Motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//               className="rounded-2xl border border-blue-100 bg-white p-7 shadow-lg shadow-blue-100/40"
//             >
//               <div className="flex items-center justify-between">
//                 <h2 className="text-xl font-bold text-gray-900">Interview history</h2>
//                 <span className="text-sm text-gray-500">Recent</span>
//               </div>
//               <div className="mt-6 space-y-4">
//                 {(sessionData
//                   ? [
//                       {
//                         title: sessionData.job_role,
//                         type: sessionData.interview_type,
//                         score: Number(window.localStorage.getItem('hilearn_latest_score') || '8.2'),
//                         status: sessionData.status,
//                       },
//                     ]
//                   : fallbackHistory
//                 ).map((item, idx) => (
//                   <Motion.div
//                     key={`${item.title}-${item.type}`}
//                     onMouseEnter={() => setHoveredHistory(idx)}
//                     onMouseLeave={() => setHoveredHistory(null)}
//                     whileHover={{ x: 5, scale: 1.01 }}
//                     className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 cursor-pointer"
//                   >
//                     <div className="flex items-start justify-between gap-4">
//                       <div>
//                         <p className="font-bold text-gray-900">{item.title}</p>
//                         <p className="mt-1 text-sm capitalize text-gray-500">{item.type}</p>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-lg font-bold text-blue-600">{Number(item.score).toFixed(1)}</p>
//                         <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">{item.status}</p>
//                       </div>
//                     </div>
//                     {hoveredHistory === idx && (
//                       <Motion.div
//                         layoutId="historyGlow"
//                         className="absolute inset-0 rounded-xl bg-blue-50/30 -z-10"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                       />
//                     )}
//                   </Motion.div>
//                 ))}
//               </div>
//               {sessionError && (
//                 <p className="mt-4 text-sm text-amber-600">
//                   Latest live session could not be loaded: {sessionError}
//                 </p>
//               )}
//             </Motion.div>

//             {/* Backend Health */}
//             <Motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.3 }}
//               className="rounded-2xl border border-blue-100 bg-white p-7 shadow-lg shadow-blue-100/40"
//             >
//               <h2 className="text-xl font-bold text-gray-900">Backend health</h2>
//               {status ? (
//                 <div className="mt-5 space-y-3">
//                   {Object.entries(status.services).map(([service, value]) => (
//                     <Motion.div
//                       key={service}
//                       whileHover={{ x: 5 }}
//                       className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 transition-all duration-200"
//                     >
//                       <span className="text-sm font-medium capitalize text-gray-700">
//                         {service.replace('_', ' ')}
//                       </span>
//                       <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
//                         value === 'healthy' 
//                           ? 'bg-emerald-100 text-emerald-700' 
//                           : 'bg-gray-200 text-gray-500'
//                       }`}>
//                         {value === 'healthy' ? '● Healthy' : '○ Offline'}
//                       </span>
//                     </Motion.div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="mt-5 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
//                   No backend status available yet.
//                 </div>
//               )}
//             </Motion.div>
//           </div>
//         </div>
//       </div>
//     </Motion.div>
//   )
// }

// export default Dashboard

import { useEffect, useMemo, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import Loader from '../components/common/Loader'
import Button from '../components/common/Button'
import { getSession, healthCheck } from '../utils/api'
import { Link } from 'react-router-dom'

const fallbackHistory = [
  { title: 'Frontend Developer', type: 'technical', score: 8.4, status: 'Completed' },
  { title: 'Product Analyst', type: 'behavioral', score: 7.8, status: 'Completed' },
]

function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState(null)
  const [sessionData, setSessionData] = useState(null)
  const [sessionError, setSessionError] = useState('')
  const [hoveredStat, setHoveredStat] = useState(null)
  const [hoveredHistory, setHoveredHistory] = useState(null)

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true)
      try {
        const [health, storedSessionId] = await Promise.all([
          healthCheck(),
          Promise.resolve(window.localStorage.getItem('hilearn_session_id')),
        ])
        setStatus(health)

        if (storedSessionId) {
          try {
            const session = await getSession(storedSessionId)
            setSessionData(session.data)
          } catch (error) {
            setSessionError(error.message)
          }
        }
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const computedStats = useMemo(() => {
    const latestScore = Number(window.localStorage.getItem('hilearn_latest_score') || '8.2')
    return [
      { label: 'Latest score', value: `${latestScore.toFixed(1)}/10`, icon: '🎯' },
      { label: 'Sessions tracked', value: sessionData ? `${sessionData.answers_count || 0}+` : '2', icon: '📊' },
      { label: 'Active systems', value: status ? Object.values(status.services).filter((value) => value === 'healthy').length : '1', icon: '⚡' },
    ]
  }, [sessionData, status])

  if (loading) {
    return <Loader label="Preparing your dashboard..." />
  }

  return (
    <Motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-100 py-14 px-4"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Hero Banner - Darker Blue */}
        <Motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 rounded-2xl bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 p-8 text-white shadow-xl shadow-blue-500/30"
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-100">
                Dashboard overview
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight">
                A focused view of your practice momentum.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-blue-100">
                Track scores, session progress, and backend status in one cleaner surface built to feel professional and easy to scan.
              </p>
            </div>
            <div className="rounded-xl bg-white/15 px-5 py-4 backdrop-blur-sm">
              <p className="text-sm text-blue-100">Latest score</p>
              <p className="mt-1 text-3xl font-bold">{computedStats[0].value}</p>
            </div>
          </div>
        </Motion.div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          
          {/* Left Section */}
          <div className="space-y-6">
            
            {/* Performance Snapshot - Darker Card */}
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-blue-200 bg-white p-8 shadow-lg shadow-blue-200/50"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
                    Performance snapshot
                  </p>
                  <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
                    Progress that feels motivating.
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
                    A student-friendly dashboard for checking readiness, recent interview signals, and backend connectivity.
                  </p>
                </div>
                <Link to="/interview">
                  <Button variant="primary" className="px-6 cursor-pointer py-2.5">
                    Start another round →
                  </Button>
                </Link>
              </div>

              {/* Stats Cards - Darker Borders */}
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {computedStats.map((item, idx) => (
                  <Motion.div
                    key={item.label}
                    onMouseEnter={() => setHoveredStat(idx)}
                    onMouseLeave={() => setHoveredStat(null)}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="relative rounded-xl border border-blue-200 bg-white p-5 shadow-md shadow-blue-200/30 cursor-pointer transition-all duration-300"
                  >
                    <Motion.div
                      animate={{
                        scale: hoveredStat === idx ? [1, 1.2, 1] : 1,
                      }}
                      transition={{ duration: 0.3 }}
                      className="text-2xl mb-2"
                    >
                      {item.icon}
                    </Motion.div>
                    <p className="text-sm text-gray-500">{item.label}</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">{item.value}</p>
                    {hoveredStat === idx && (
                      <Motion.div
                        layoutId="statGlow"
                        className="absolute inset-0 rounded-xl bg-blue-50/50 -z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </Motion.div>
                ))}
              </div>

              {/* Confidence Chart */}
              <div className="mt-8 rounded-xl bg-gray-900 p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-gray-400">
                      Communication trend
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-white">
                      Confidence growth over recent sessions
                    </h2>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
                    +18% this week
                  </span>
                </div>
                <div className="mt-8 flex items-end gap-4">
                  {[56, 64, 72, 81, 88].map((height, index) => (
                    <div key={height} className="flex-1">
                      <Motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="rounded-t-xl bg-gradient-to-t from-blue-500 to-blue-400"
                        style={{ height: `${height}%`, minHeight: '72px' }}
                      />
                      <p className="mt-3 text-center text-xs text-gray-400">W{index + 1}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Motion.div>
          </div>

          {/* Right Section */}
          <div className="space-y-6">
            
            {/* Interview History - Darker Card */}
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-blue-200 bg-white p-7 shadow-lg shadow-blue-200/50"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Interview history</h2>
                <span className="text-sm text-gray-500">Recent</span>
              </div>
              <div className="mt-6 space-y-4">
                {(sessionData
                  ? [
                      {
                        title: sessionData.job_role,
                        type: sessionData.interview_type,
                        score: Number(window.localStorage.getItem('hilearn_latest_score') || '8.2'),
                        status: sessionData.status,
                      },
                    ]
                  : fallbackHistory
                ).map((item, idx) => (
                  <Motion.div
                    key={`${item.title}-${item.type}`}
                    onMouseEnter={() => setHoveredHistory(idx)}
                    onMouseLeave={() => setHoveredHistory(null)}
                    whileHover={{ x: 5, scale: 1.01 }}
                    className="relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold text-gray-900">{item.title}</p>
                        <p className="mt-1 text-sm capitalize text-gray-500">{item.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">{Number(item.score).toFixed(1)}</p>
                        <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">{item.status}</p>
                      </div>
                    </div>
                    {hoveredHistory === idx && (
                      <Motion.div
                        layoutId="historyGlow"
                        className="absolute inset-0 rounded-xl bg-blue-50/30 -z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </Motion.div>
                ))}
              </div>
              {sessionError && (
                <p className="mt-4 text-sm text-amber-600">
                  Latest live session could not be loaded: {sessionError}
                </p>
              )}
            </Motion.div>

            {/* Backend Health - Darker Card */}
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-blue-200 bg-white p-7 shadow-lg shadow-blue-200/50"
            >
              <h2 className="text-xl font-bold text-gray-900">Backend health</h2>
              {status ? (
                <div className="mt-5 space-y-3">
                  {Object.entries(status.services).map(([service, value]) => (
                    <Motion.div
                      key={service}
                      whileHover={{ x: 5 }}
                      className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all duration-200"
                    >
                      <span className="text-sm font-medium capitalize text-gray-700">
                        {service.replace('_', ' ')}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        value === 'healthy' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {value === 'healthy' ? '● Healthy' : '○ Offline'}
                      </span>
                    </Motion.div>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
                  No backend status available yet.
                </div>
              )}
            </Motion.div>
          </div>
        </div>
      </div>
    </Motion.div>
  )
}

export default Dashboard