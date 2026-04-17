
// import { motion as Motion } from 'framer-motion'
// import { Link } from 'react-router-dom'
// import { useState } from 'react'

// function Login() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [emailFocused, setEmailFocused] = useState(false)
//   const [passwordFocused, setPasswordFocused] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     setIsLoading(true)
//     // Simulate login - backend ready hone par connect karna
//     setTimeout(() => {
//       setIsLoading(false)
//       console.log('Login attempted', { email, password })
//     }, 1000)
//   }

//   return (
//     <Motion.div
//       initial={{ opacity: 0, y: 14 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="min-h-screen bg-gray-50 py-20 px-4"
//     >
//       <div className="max-w-6xl mx-auto">
//         <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
          
//           {/* Left Side - Hero Section */}
//           <Motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5 }}
//             className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-blue-600 p-8 text-white shadow-xl shadow-blue-500/30"
//           >
//             {/* Animated Background */}
//             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
//             <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32" />
            
//             <div className="relative z-10">
//               <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-100">
//                 👋 Welcome back
//               </p>
//               <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
//                 Sign in to continue your prep journey.
//               </h1>
//               <p className="mt-4 text-base leading-7 text-blue-100">
//                 This auth surface is frontend-ready and visually polished, while remaining backend-safe until auth APIs are available.
//               </p>
              
//               <div className="mt-8 space-y-3">
//                 {[
//                   { emoji: '📊', text: 'Track interview streaks' },
//                   { emoji: '📝', text: 'Review feedback history' },
//                   { emoji: '🚀', text: 'Access plan upgrades' },
//                 ].map((item, idx) => (
//                   <Motion.div
//                     key={idx}
//                     initial={{ opacity: 0, x: -10 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: 0.2 + idx * 0.1 }}
//                     className="flex items-center gap-3 text-sm leading-7 text-blue-100"
//                   >
//                     <span className="text-xl">{item.emoji}</span>
//                     <span>{item.text}</span>
//                   </Motion.div>
//                 ))}
//               </div>
//             </div>
//           </Motion.div>

//           {/* Right Side - Login Form */}
//           <Motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5, delay: 0.1 }}
//             className="rounded-2xl border border-blue-100 bg-white p-8 shadow-xl shadow-blue-100/40"
//           >
//             <div className="text-center mb-6">
//               <h2 className="text-2xl font-bold text-gray-900">Login to Your Account</h2>
//               <p className="text-sm text-gray-500 mt-1">Enter your credentials to access your dashboard</p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-5">
//               {/* Email Field */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
//                   <span>📧</span> Email address
//                 </label>
//                 <div className={`relative rounded-xl border transition-all duration-200 ${
//                   emailFocused 
//                     ? 'border-blue-500 ring-2 ring-blue-500/20' 
//                     : 'border-gray-200 hover:border-blue-300'
//                 }`}>
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     onFocus={() => setEmailFocused(true)}
//                     onBlur={() => setEmailFocused(false)}
//                     className="w-full rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 outline-none bg-white"
//                     placeholder="student@college.edu"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Password Field */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
//                   <span>🔒</span> Password
//                 </label>
//                 <div className={`relative rounded-xl border transition-all duration-200 ${
//                   passwordFocused 
//                     ? 'border-blue-500 ring-2 ring-blue-500/20' 
//                     : 'border-gray-200 hover:border-blue-300'
//                 }`}>
//                   <input
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     onFocus={() => setPasswordFocused(true)}
//                     onBlur={() => setPasswordFocused(false)}
//                     className="w-full rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 outline-none bg-white"
//                     placeholder="Enter your password"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Forgot Password Link */}
//               <div className="text-right">
//                 <Link 
//                   to="/forgot-password" 
//                   className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
//                 >
//                   Forgot password?
//                 </Link>
//               </div>

//               {/* Submit Button */}
//               <Motion.div
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//               >
//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="w-full cursor-pointer rounded-xl bg-blue-600 px-4 py-3 text-white font-semibold shadow-md shadow-blue-500/30 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
//                 >
//                   {isLoading ? (
//                     <span className="flex items-center justify-center gap-2">
//                       <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Signing in...
//                     </span>
//                   ) : (
//                     'Sign in →'
//                   )}
//                 </button>
//               </Motion.div>
//             </form>

//             {/* Divider */}
//             <div className="relative my-6">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-200"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-4 bg-white text-gray-500">or</span>
//               </div>
//             </div>

//             {/* Demo Credentials */}
//             <div className="rounded-xl bg-blue-50 p-4 border border-blue-100">
//               <p className="text-xs font-semibold text-blue-700 mb-2">🎯 Demo Credentials</p>
//               <div className="space-y-1 text-xs text-blue-600">
//                 <p>📧 Email: demo@hilearn.ai</p>
//                 <p>🔒 Password: demo123</p>
//               </div>
//             </div>

//             {/* Sign Up Link */}
//             <p className="mt-6 text-center text-sm text-gray-500">
//               New here?{' '}
//               <Link 
//                 to="/signup" 
//                 className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
//               >
//                 Create your account
//               </Link>
//             </p>
//           </Motion.div>
//         </div>
//       </div>
//     </Motion.div>
//   )
// }

// export default Login

import { motion as Motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState } from 'react'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      console.log('Login attempted', { email, password })
    }, 1000)
  }

  return (
    <Motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-100 py-20 px-4"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
          
          {/* Left Side - Hero Section - Darker */}
          <Motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 p-8 text-white shadow-xl shadow-blue-500/30"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32" />
            
            <div className="relative z-10">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-100">
                👋 Welcome back
              </p>
              <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
                Sign in to continue your prep journey.
              </h1>
              <p className="mt-4 text-base leading-7 text-blue-100">
                Access your dashboard, track progress, and continue where you left off.
              </p>
              
              <div className="mt-8 space-y-3">
                {[
                  { emoji: '📊', text: 'Track interview streaks' },
                  { emoji: '📝', text: 'Review feedback history' },
                  { emoji: '🚀', text: 'Access plan upgrades' },
                  { emoji: '🎯', text: 'Personalized recommendations' },
                ].map((item, idx) => (
                  <Motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className="flex items-center gap-3 text-sm leading-7 text-blue-100"
                  >
                    <span className="text-xl">{item.emoji}</span>
                    <span>{item.text}</span>
                  </Motion.div>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-8 pt-4 border-t border-white/20 flex justify-between text-xs text-blue-200">
                <span>⭐ 4.9/5 rating</span>
                <span>🎓 10K+ students</span>
                <span>💬 24/7 support</span>
              </div>
            </div>
          </Motion.div>

          {/* Right Side - Login Form - Darker */}
          <Motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-blue-200 bg-white p-8 shadow-xl shadow-blue-200/50"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Login to Your Account</h2>
              <p className="text-sm text-gray-500 mt-1">Enter your credentials to access your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <span>📧</span> Email address
                </label>
                <div className={`relative rounded-xl border transition-all duration-200 ${
                  emailFocused 
                    ? 'border-blue-500 ring-2 ring-blue-500/20' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    className="w-full rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 outline-none bg-white"
                    placeholder="student@college.edu"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <span>🔒</span> Password
                </label>
                <div className={`relative rounded-xl border transition-all duration-200 ${
                  passwordFocused 
                    ? 'border-blue-500 ring-2 ring-blue-500/20' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    className="w-full rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 outline-none bg-white"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full cursor-pointer rounded-xl bg-blue-600 px-4 py-3 text-white font-semibold shadow-md shadow-blue-500/30 hover:bg-blue-700 hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    'Sign in →'
                  )}
                </button>
              </Motion.div>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Demo Credentials */}
            <div className="rounded-xl bg-blue-50 p-4 border border-blue-200">
              <p className="text-xs font-semibold text-blue-700 mb-2">🎯 Demo Credentials</p>
              <div className="space-y-1 text-xs text-blue-600">
                <p>📧 Email: demo@hilearn.ai</p>
                <p>🔒 Password: demo123</p>
              </div>
            </div>

            {/* Sign Up Link */}
            <p className="mt-6 text-center text-sm text-gray-500">
              New here?{' '}
              <Link 
                to="/signup" 
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Create your account
              </Link>
            </p>
          </Motion.div>
        </div>
      </div>
    </Motion.div>
  )
}

export default Login