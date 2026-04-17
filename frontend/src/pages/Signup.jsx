
// import { motion as Motion } from 'framer-motion'
// import { Link } from 'react-router-dom'
// import { useState } from 'react'

// function Signup() {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   })
//   const [focusedField, setFocusedField] = useState(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const [errors, setErrors] = useState({})

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData(prev => ({ ...prev, [name]: value }))
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }))
//     }
//   }

//   const validateForm = () => {
//     const newErrors = {}
//     if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
//     if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required'
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Email is invalid'
//     }
//     if (!formData.password) {
//       newErrors.password = 'Password is required'
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters'
//     }
//     if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match'
//     }
//     return newErrors
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     const newErrors = validateForm()
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors)
//       return
//     }
    
//     setIsLoading(true)
//     // Simulate signup - backend ready hone par connect karna
//     setTimeout(() => {
//       setIsLoading(false)
//       console.log('Signup attempted', formData)
//     }, 1000)
//   }

//   const inputFields = [
//     { name: 'firstName', label: 'First name', type: 'text', placeholder: 'Aarav', icon: '👤', colSpan: false },
//     { name: 'lastName', label: 'Last name', type: 'text', placeholder: 'Sharma', icon: '👤', colSpan: false },
//     { name: 'email', label: 'Email', type: 'email', placeholder: 'aarav@example.com', icon: '📧', colSpan: true },
//     { name: 'password', label: 'Password', type: 'password', placeholder: 'Create a secure password', icon: '🔒', colSpan: true },
//     { name: 'confirmPassword', label: 'Confirm password', type: 'password', placeholder: 'Confirm your password', icon: '✓', colSpan: true },
//   ]

//   return (
//     <Motion.div
//       initial={{ opacity: 0, y: 14 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="min-h-screen bg-gray-50 py-20 px-4"
//     >
//       <div className="max-w-6xl mx-auto">
//         <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          
//           {/* Left Side - Signup Form */}
//           <Motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5 }}
//             className="rounded-2xl border border-blue-100 bg-white p-8 shadow-xl shadow-blue-100/40"
//           >
//             <div className="text-center mb-6">
//               <h2 className="text-2xl font-bold text-gray-900">✨ Create an account</h2>
//               <p className="text-sm text-gray-500 mt-1">Start your interview preparation journey</p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="grid gap-4 md:grid-cols-2">
//                 {inputFields.map((field) => (
//                   <div key={field.name} className={field.colSpan ? 'md:col-span-2' : ''}>
//                     <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-2">
//                       <span>{field.icon}</span> {field.label}
//                       <span className="text-red-500 text-xs">*</span>
//                     </label>
//                     <div className={`relative rounded-xl border transition-all duration-200 ${
//                       focusedField === field.name 
//                         ? 'border-blue-500 ring-2 ring-blue-500/20' 
//                         : errors[field.name] 
//                           ? 'border-red-500' 
//                           : 'border-gray-200 hover:border-blue-300'
//                     }`}>
//                       <input
//                         type={field.type}
//                         name={field.name}
//                         value={formData[field.name]}
//                         onChange={handleChange}
//                         onFocus={() => setFocusedField(field.name)}
//                         onBlur={() => setFocusedField(null)}
//                         className="w-full rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 outline-none bg-white"
//                         placeholder={field.placeholder}
//                       />
//                     </div>
//                     {errors[field.name] && (
//                       <p className="mt-1 text-xs text-red-500">{errors[field.name]}</p>
//                     )}
//                   </div>
//                 ))}
//               </div>

//               {/* Terms Agreement */}
//               <div className="flex items-center gap-2 mt-4">
//                 <input
//                   type="checkbox"
//                   id="terms"
//                   className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                   required
//                 />
//                 <label htmlFor="terms" className="text-xs text-gray-600">
//                   I agree to the{' '}
//                   <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
//                   {' '}and{' '}
//                   <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
//                 </label>
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
//                       Creating account...
//                     </span>
//                   ) : (
//                     'Create account →'
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

//             {/* Sign In Link */}
//             <p className="text-center text-sm text-gray-500">
//               Already have an account?{' '}
//               <Link 
//                 to="/login" 
//                 className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
//               >
//                 Sign in
//               </Link>
//             </p>
//           </Motion.div>

//           {/* Right Side - Benefits */}
//           <Motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5, delay: 0.1 }}
//             className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-blue-600 p-8 text-white shadow-xl shadow-blue-500/30"
//           >
//             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
//             <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32" />
            
//             <div className="relative z-10">
//               <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-100">
//                 🎯 What you unlock
//               </p>
//               <h2 className="mt-2 text-2xl font-bold">Join 10,000+ successful students</h2>
//               <p className="mt-2 text-sm text-blue-100">Get access to premium interview preparation tools</p>
              
//               <div className="mt-6 space-y-3">
//                 {[
//                   { emoji: '🤖', text: 'Role-based AI interview rooms' },
//                   { emoji: '📊', text: 'Beautiful feedback summaries with scorecards' },
//                   { emoji: '📈', text: 'Dashboard-ready progress tracking' },
//                   { emoji: '🚀', text: 'Plan upgrade flow for deeper practice' },
//                   { emoji: '🎯', text: 'Personalized question generation' },
//                   { emoji: '💡', text: 'Real-time answer suggestions' },
//                 ].map((item, idx) => (
//                   <Motion.div
//                     key={idx}
//                     initial={{ opacity: 0, x: -10 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: 0.2 + idx * 0.1 }}
//                     whileHover={{ x: 5 }}
//                     className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white backdrop-blur-sm transition-all duration-200 cursor-pointer"
//                   >
//                     <span className="text-xl">{item.emoji}</span>
//                     <span>{item.text}</span>
//                   </Motion.div>
//                 ))}
//               </div>

//               {/* Trust Badge */}
//               <div className="mt-6 pt-4 border-t border-white/20">
//                 <div className="flex items-center justify-between text-xs text-blue-100">
//                   <span>⭐ 4.9/5 rating</span>
//                   <span>🎓 10,000+ students</span>
//                   <span>🔄 Free trial available</span>
//                 </div>
//               </div>
//             </div>
//           </Motion.div>
//         </div>
//       </div>
//     </Motion.div>
//   )
// }

// export default Signup

import { motion as Motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState } from 'react'

function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [focusedField, setFocusedField] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      console.log('Signup attempted', formData)
    }, 1000)
  }

  const inputFields = [
    { name: 'firstName', label: 'First name', type: 'text', placeholder: 'Aarav', icon: '👤', colSpan: false },
    { name: 'lastName', label: 'Last name', type: 'text', placeholder: 'Sharma', icon: '👤', colSpan: false },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'aarav@example.com', icon: '📧', colSpan: true },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Create a secure password', icon: '🔒', colSpan: true },
    { name: 'confirmPassword', label: 'Confirm password', type: 'password', placeholder: 'Confirm your password', icon: '✓', colSpan: true },
  ]

  return (
    <Motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-100 py-20 px-4"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          
          {/* Left Side - Signup Form - Darker */}
          <Motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-blue-200 bg-white p-8 shadow-xl shadow-blue-200/50"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">✨ Create an account</h2>
              <p className="text-sm text-gray-500 mt-1">Start your interview preparation journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {inputFields.map((field) => (
                  <div key={field.name} className={field.colSpan ? 'md:col-span-2' : ''}>
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-2">
                      <span>{field.icon}</span> {field.label}
                      <span className="text-red-500 text-xs">*</span>
                    </label>
                    <div className={`relative rounded-xl border transition-all duration-200 ${
                      focusedField === field.name 
                        ? 'border-blue-500 ring-2 ring-blue-500/20' 
                        : errors[field.name] 
                          ? 'border-red-500' 
                          : 'border-gray-200 hover:border-blue-300'
                    }`}>
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        onFocus={() => setFocusedField(field.name)}
                        onBlur={() => setFocusedField(null)}
                        className="w-full rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 outline-none bg-white"
                        placeholder={field.placeholder}
                      />
                    </div>
                    {errors[field.name] && (
                      <p className="mt-1 text-xs text-red-500">{errors[field.name]}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Terms Agreement */}
              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  required
                />
                <label htmlFor="terms" className="text-xs text-gray-600">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                </label>
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
                      Creating account...
                    </span>
                  ) : (
                    'Create account →'
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

            {/* Sign In Link */}
            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Sign in
              </Link>
            </p>
          </Motion.div>

          {/* Right Side - Benefits - Darker */}
          <Motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 p-8 text-white shadow-xl shadow-blue-500/30"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32" />
            
            <div className="relative z-10">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-100">
                🎯 What you unlock
              </p>
              <h2 className="mt-2 text-2xl font-bold">Join 10,000+ successful students</h2>
              <p className="mt-2 text-sm text-blue-100">Get access to premium interview preparation tools</p>
              
              <div className="mt-6 space-y-3">
                {[
                  { emoji: '🤖', text: 'Role-based AI interview rooms' },
                  { emoji: '📊', text: 'Beautiful feedback summaries with scorecards' },
                  { emoji: '📈', text: 'Dashboard-ready progress tracking' },
                  { emoji: '🚀', text: 'Plan upgrade flow for deeper practice' },
                  { emoji: '🎯', text: 'Personalized question generation' },
                  { emoji: '💡', text: 'Real-time answer suggestions' },
                ].map((item, idx) => (
                  <Motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white backdrop-blur-sm transition-all duration-200 cursor-pointer"
                  >
                    <span className="text-xl">{item.emoji}</span>
                    <span>{item.text}</span>
                  </Motion.div>
                ))}
              </div>

              {/* Trust Badge */}
              <div className="mt-6 pt-4 border-t border-white/20">
                <div className="flex items-center justify-between text-xs text-blue-200">
                  <span>⭐ 4.9/5 rating</span>
                  <span>🎓 10,000+ students</span>
                  <span>🔄 Free trial available</span>
                </div>
              </div>
            </div>
          </Motion.div>
        </div>
      </div>
    </Motion.div>
  )
}

export default Signup