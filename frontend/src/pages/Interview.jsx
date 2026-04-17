

// import { useEffect, useMemo, useRef, useState } from 'react'
// import { motion as Motion } from 'framer-motion'
// import { useNavigate } from 'react-router-dom'
// import Button from '../components/common/Button'
// import Loader from '../components/common/Loader'
// import { startInterview, submitAnswer } from '../utils/api'

// const interviewTypes = [
//   { value: 'technical', label: 'Technical', icon: '💻', description: 'Coding, algorithms, system design' },
//   { value: 'behavioral', label: 'Behavioral', icon: '🗣️', description: 'Past experiences, teamwork, leadership' },
//   { value: 'hr', label: 'HR', icon: '👥', description: 'Company fit, career goals' },
//   { value: 'domain_specific', label: 'Domain specific', icon: '🎯', description: 'Industry-specific knowledge' },
// ]

// const difficultyOptions = [
//   { value: 'beginner', label: 'Beginner', color: 'emerald', description: 'Basic concepts' },
//   { value: 'intermediate', label: 'Intermediate', color: 'blue', description: 'Practical scenarios' },
//   { value: 'advanced', label: 'Advanced', color: 'purple', description: 'Complex problems' },
// ]

// function Interview() {
//   const navigate = useNavigate()
//   const [stage, setStage] = useState('setup')
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
//   const [timer, setTimer] = useState(0)
//   const [session, setSession] = useState(null)
//   const [question, setQuestion] = useState(null)
//   const [answer, setAnswer] = useState('')
//   const [hoveredType, setHoveredType] = useState(null)
//   const [hoveredDifficulty, setHoveredDifficulty] = useState(null)
//   const [form, setForm] = useState({
//     user_id: 'student_demo',
//     job_role: '',
//     interview_type: 'technical',
//     difficulty: 'intermediate',
//     tech_stack: '',
//     resume_text: '',
//     target_companies: '',
//   })
//   const timerRef = useRef(null)

//   useEffect(() => {
//     if (stage === 'live') {
//       timerRef.current = window.setInterval(() => setTimer((previous) => previous + 1), 1000)
//     }

//     return () => {
//       if (timerRef.current) {
//         window.clearInterval(timerRef.current)
//       }
//     }
//   }, [stage, question?.question_id])

//   const formattedTime = useMemo(() => {
//     const minutes = String(Math.floor(timer / 60)).padStart(2, '0')
//     const seconds = String(timer % 60).padStart(2, '0')
//     return `${minutes}:${seconds}`
//   }, [timer])

//   const handleStartInterview = async () => {
//     if (!form.job_role.trim()) {
//       setError('✨ Add your target job role to start the interview.')
//       return
//     }

//     setLoading(true)
//     setError('')
//     try {
//       const payload = {
//         ...form,
//         tech_stack: form.tech_stack ? form.tech_stack.split(',').map((item) => item.trim()).filter(Boolean) : undefined,
//         target_companies: form.target_companies ? form.target_companies.split(',').map((item) => item.trim()).filter(Boolean) : undefined,
//         resume_text: form.resume_text || undefined,
//       }

//       const response = await startInterview(payload)
//       setSession(response)
//       setQuestion(response.first_question)
//       setStage('live')
//       setTimer(0)
//       window.localStorage.setItem('hilearn_session_id', response.session_id)
//     } catch (requestError) {
//       setError(requestError.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSubmit = async () => {
//     if (!answer.trim() || !session || !question) {
//       setError('✍️ Write your answer before sending it for feedback.')
//       return
//     }

//     setLoading(true)
//     setError('')
//     try {
//       const response = await submitAnswer({
//         session_id: session.session_id,
//         question_id: question.question_id,
//         answer_text: answer,
//         answer_duration_seconds: timer,
//       })

//       window.localStorage.setItem('hilearn_latest_score', String(response.feedback.overall_score))
//       window.localStorage.setItem('hilearn_feedback', JSON.stringify(response))

//       // ✅ Agar next question hai toh dikhao
//       if (response.next_question) {
//         setQuestion(response.next_question)
//         setAnswer('')
//         setTimer(0)
//         if (timerRef.current) window.clearInterval(timerRef.current)
//       } else {
//         // ✅ Koi question nahi bachaa — ab feedback pe jao
//         if (timerRef.current) window.clearInterval(timerRef.current)
//         navigate('/feedback', {
//           state: { feedbackResponse: response, session },
//         })
//       }
//     } catch (requestError) {
//       setError(requestError.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (loading && stage === 'setup') {
//     return <Loader label="🎯 Starting your interview room..." />
//   }

//   return (
//     <Motion.div
//       initial={{ opacity: 0, y: 14 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="min-h-screen bg-gray-100 py-14 px-4"
//     >
//       <div className="max-w-7xl mx-auto">

//         {stage === 'setup' && (
//           <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">

//             {/* Left Section - Info */}
//             <div className="space-y-6">
//               <Motion.div
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="rounded-2xl bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 p-8 text-white shadow-xl shadow-blue-500/30"
//               >
//                 <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-100">
//                   🎙️ Interview lab
//                 </p>
//                 <h1 className="mt-3 text-4xl font-bold tracking-tight">
//                   Step into a calm, realistic practice room.
//                 </h1>
//                 <p className="mt-4 max-w-xl text-base leading-7 text-blue-100">
//                   Choose your interview type, role, and difficulty, then launch a backend-connected session with the first live AI question.
//                 </p>
//                 <div className="mt-6 grid gap-3 sm:grid-cols-3">
//                   {[
//                     { emoji: '🎯', text: 'Role setup' },
//                     { emoji: '💬', text: 'Live question flow' },
//                     { emoji: '📊', text: 'Feedback after each answer' },
//                   ].map((item) => (
//                     <div key={item.text} className="rounded-xl bg-white/15 px-4 py-3 text-sm font-medium text-white backdrop-blur-sm">
//                       {item.emoji} {item.text}
//                     </div>
//                   ))}
//                 </div>
//               </Motion.div>

//               <Motion.div
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.1, duration: 0.5 }}
//                 className="rounded-2xl border border-blue-200 bg-white p-6 shadow-lg shadow-blue-200/50"
//               >
//                 <p className="text-sm font-semibold text-gray-900">🔌 What this setup connects to</p>
//                 <div className="mt-4 space-y-3">
//                   {[
//                     'Starts real interview sessions from FastAPI',
//                     'Submits typed answers to the existing feedback endpoint',
//                     'Stores only lightweight session context in localStorage',
//                   ].map((item, idx) => (
//                     <Motion.div
//                       key={item}
//                       initial={{ opacity: 0, x: -10 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: 0.2 + idx * 0.1 }}
//                       className="flex items-center gap-3 text-sm text-gray-600"
//                     >
//                       <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs">✓</span>
//                       <span>{item}</span>
//                     </Motion.div>
//                   ))}
//                 </div>
//               </Motion.div>

//               {/* Tips Card - Enhanced */}
//               <Motion.div
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.2, duration: 0.5 }}
//                 className="rounded-2xl bg-gradient-to-r from-blue-50 to-white p-6 border border-blue-200"
//               >
//                 <p className="text-sm font-semibold text-blue-600">💡 Pro Tips for Success</p>
//                 <div className="mt-3 space-y-2">
//                   <p className="text-sm text-gray-600">• Be specific with your tech stack and target companies</p>
//                   <p className="text-sm text-gray-600">• Use STAR method (Situation, Task, Action, Result)</p>
//                   <p className="text-sm text-gray-600">• Practice speaking clearly and concisely</p>
//                 </div>
//               </Motion.div>

//               {/* Quick Stats */}
//               <Motion.div
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.25, duration: 0.5 }}
//                 className="rounded-2xl bg-white p-6 border border-blue-200 shadow-md"
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="text-center flex-1">
//                     <p className="text-2xl font-bold text-blue-600">10K+</p>
//                     <p className="text-xs text-gray-500">Interviews Completed</p>
//                   </div>
//                   <div className="w-px h-8 bg-gray-200" />
//                   <div className="text-center flex-1">
//                     <p className="text-2xl font-bold text-blue-600">92%</p>
//                     <p className="text-xs text-gray-500">Confidence Boost</p>
//                   </div>
//                   <div className="w-px h-8 bg-gray-200" />
//                   <div className="text-center flex-1">
//                     <p className="text-2xl font-bold text-blue-600">4.9</p>
//                     <p className="text-xs text-gray-500">Student Rating</p>
//                   </div>
//                 </div>
//               </Motion.div>
//             </div>

//             {/* Right Section - Form */}
//             <Motion.div
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5 }}
//               className="rounded-2xl border border-blue-200 bg-white p-8 shadow-xl shadow-blue-200/50"
//             >
//               <h2 className="text-2xl font-bold text-gray-900 mb-2">🎮 Interview Setup</h2>
//               <p className="text-sm text-gray-500 mb-6">Fill in the details to get personalized questions</p>

//               <div className="grid gap-5 md:grid-cols-2">
//                 <label className="space-y-2 md:col-span-2">
//                   <span className="text-sm font-medium text-gray-700">🎯 Target role <span className="text-red-500">*</span></span>
//                   <input
//                     value={form.job_role}
//                     onChange={(event) => setForm((previous) => ({ ...previous, job_role: event.target.value }))}
//                     placeholder="e.g., Frontend Developer, Data Analyst, SDE Intern"
//                     className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
//                   />
//                 </label>

//                 <label className="space-y-2">
//                   <span className="text-sm font-medium text-gray-700">📋 Interview type</span>
//                   <div className="grid grid-cols-2 gap-2">
//                     {interviewTypes.map((item) => (
//                       <Motion.div
//                         key={item.value}
//                         whileHover={{ scale: 1.02 }}
//                         onClick={() => setForm((prev) => ({ ...prev, interview_type: item.value }))}
//                         onMouseEnter={() => setHoveredType(item.value)}
//                         onMouseLeave={() => setHoveredType(null)}
//                         className={`cursor-pointer rounded-xl border p-3 text-center transition-all duration-200 ${form.interview_type === item.value
//                             ? 'border-blue-500 bg-blue-50 text-blue-700'
//                             : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50'
//                           }`}
//                       >
//                         <span className="text-xl block mb-1">{item.icon}</span>
//                         <span className="text-sm font-medium">{item.label}</span>
//                         {hoveredType === item.value && (
//                           <p className="text-xs text-gray-400 mt-1">{item.description}</p>
//                         )}
//                       </Motion.div>
//                     ))}
//                   </div>
//                 </label>

//                 <label className="space-y-2">
//                   <span className="text-sm font-medium text-gray-700">⚡ Difficulty</span>
//                   <div className="flex gap-2">
//                     {difficultyOptions.map((item) => (
//                       <Motion.div
//                         key={item.value}
//                         whileHover={{ scale: 1.02 }}
//                         onClick={() => setForm((prev) => ({ ...prev, difficulty: item.value }))}
//                         onMouseEnter={() => setHoveredDifficulty(item.value)}
//                         onMouseLeave={() => setHoveredDifficulty(null)}
//                         className={`flex-1 cursor-pointer rounded-xl border p-3 text-center transition-all duration-200 ${form.difficulty === item.value
//                             ? `border-${item.color}-500 bg-${item.color}-50 text-${item.color}-700`
//                             : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50'
//                           }`}
//                       >
//                         <span className="text-sm font-medium">{item.label}</span>
//                         {hoveredDifficulty === item.value && (
//                           <p className="text-xs text-gray-400 mt-1">{item.description}</p>
//                         )}
//                       </Motion.div>
//                     ))}
//                   </div>
//                 </label>

//                 <label className="space-y-2">
//                   <span className="text-sm font-medium text-gray-700">🛠️ Tech stack</span>
//                   <input
//                     value={form.tech_stack}
//                     onChange={(event) => setForm((previous) => ({ ...previous, tech_stack: event.target.value }))}
//                     placeholder="React, Python, Java, AWS (comma separated)"
//                     className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
//                   />
//                 </label>

//                 <label className="space-y-2">
//                   <span className="text-sm font-medium text-gray-700">🏢 Target companies</span>
//                   <input
//                     value={form.target_companies}
//                     onChange={(event) => setForm((previous) => ({ ...previous, target_companies: event.target.value }))}
//                     placeholder="Google, Microsoft, Amazon, TCS (comma separated)"
//                     className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
//                   />
//                 </label>

//                 <label className="space-y-2 md:col-span-2">
//                   <span className="text-sm font-medium text-gray-700">📄 Resume summary (optional)</span>
//                   <textarea
//                     rows={3}
//                     value={form.resume_text}
//                     onChange={(event) => setForm((previous) => ({ ...previous, resume_text: event.target.value }))}
//                     placeholder="Paste a short summary of your experience, skills, and projects to help personalize the session..."
//                     className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
//                   />
//                   <p className="text-xs text-gray-400">This helps AI generate more relevant questions for your background</p>
//                 </label>
//               </div>

//               {error && (
//                 <Motion.div
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700"
//                 >
//                   {error}
//                 </Motion.div>
//               )}

//               <Button onClick={handleStartInterview} className="mt-6 w-full cursor-pointer justify-center py-3.5 text-base">
//                 🚀 Start interview
//               </Button>
//             </Motion.div>
//           </div>
//         )}

//         {/* Live Interview Stage */}
//         {stage === 'live' && session && question && (
//           <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">

//             {/* Left Sidebar */}
//             <Motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               className="space-y-6"
//             >
//               <div className="rounded-2xl bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 p-6 text-white shadow-xl shadow-blue-500/30">
//                 <p className="text-xs uppercase tracking-[0.24em] text-blue-100">📋 Session</p>
//                 <h2 className="mt-3 text-2xl font-bold">{session.job_role}</h2>
//                 <div className="mt-4 flex flex-wrap gap-2 text-sm">
//                   <span className="rounded-full bg-white/20 px-3 py-1 capitalize">{session.interview_type}</span>
//                   <span className="rounded-full bg-white/20 px-3 py-1 capitalize">{session.difficulty}</span>
//                   <span className="rounded-full bg-white/20 px-3 py-1">{session.total_questions} questions</span>
//                 </div>
//               </div>

//               <div className="rounded-2xl border border-blue-200 bg-white p-6 shadow-lg shadow-blue-200/50">
//                 <p className="text-sm text-gray-500">⏱️ Elapsed answer time</p>
//                 <p className="mt-2 text-5xl font-bold text-blue-600">{formattedTime}</p>
//                 <div className="mt-4 h-2 w-full rounded-full bg-gray-100">
//                   <Motion.div
//                     initial={{ width: 0 }}
//                     animate={{ width: `${(timer / 300) * 100}%` }}
//                     className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
//                   />
//                 </div>
//                 <p className="mt-4 text-sm leading-6 text-gray-500">
//                   🎙️ Voice input is coming soon! Type your answer below for now.
//                 </p>
//               </div>

//               {/* Progress Indicator */}
//               <div className="rounded-2xl border border-blue-200 bg-white p-6 shadow-lg shadow-blue-200/50">
//                 <p className="text-sm font-semibold text-gray-700">📊 Session Progress</p>
//                 <div className="mt-3 flex items-center gap-2">
//                   <div className="flex-1 h-2 rounded-full bg-gray-100">
//                     <div className="w-1/3 h-full rounded-full bg-blue-600" />
//                   </div>
//                   <span className="text-sm text-gray-500">Question 1/{session.total_questions}</span>
//                 </div>
//               </div>

//               {/* Answer Tips */}
//               <div className="rounded-2xl border border-blue-200 bg-blue-50/30 p-6 shadow-sm">
//                 <p className="text-sm font-semibold text-blue-700">📝 Answer Tips</p>
//                 <ul className="mt-2 space-y-1 text-xs text-gray-600">
//                   <li>• Use specific examples from your experience</li>
//                   <li>• Structure your answer clearly</li>
//                   <li>• Be honest and authentic</li>
//                 </ul>
//               </div>
//             </Motion.div>

//             {/* Right Section - Question & Answer */}
//             <div className="space-y-6">
//               <Motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="rounded-2xl border border-blue-200 bg-white p-7 shadow-lg shadow-blue-200/50"
//               >
//                 <div className="flex items-center justify-between gap-4">
//                   <div>
//                     <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
//                       🤖 AI interviewer
//                     </p>
//                     <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
//                       Current question
//                     </h1>
//                   </div>
//                   <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
//                     {question.topic || 'Live round'}
//                   </div>
//                 </div>
//                 <div className="mt-6 rounded-xl bg-gray-50 p-6 border border-gray-200">
//                   <p className="text-lg leading-8 text-gray-800">{question.question_text}</p>
//                 </div>
//               </Motion.div>

//               <Motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.1 }}
//                 className="rounded-2xl border border-blue-200 bg-white p-7 shadow-lg shadow-blue-200/50"
//               >
//                 <div className="flex items-center justify-between gap-4">
//                   <div>
//                     <h2 className="text-xl font-bold text-gray-900">✍️ Your answer</h2>
//                     <p className="mt-1 text-sm text-gray-500">Type naturally or use the voice CTA as a guided input surface.</p>
//                   </div>
//                   <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
//                     {answer.trim() ? `${answer.trim().split(/\s+/).length} words` : '0 words'}
//                   </span>
//                 </div>

//                 <textarea
//                   rows={10}
//                   value={answer}
//                   onChange={(event) => setAnswer(event.target.value)}
//                   placeholder="Structure your answer with examples, context, actions, and outcomes..."
//                   className="mt-5 w-full rounded-xl border border-gray-200 px-5 py-4 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
//                 />

//                 {error && (
//                   <Motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700"
//                   >
//                     {error}
//                   </Motion.div>
//                 )}

//                 <div className="mt-5 flex flex-col gap-3 sm:flex-row">
//                   <Button onClick={handleSubmit} className="flex-1 cursor-pointer justify-center py-3.5" disabled={loading}>
//                     {loading ? '⏳ Submitting...' : '✨ Submit for AI feedback'}
//                   </Button>
//                   <Button variant="secondary" onClick={() => setAnswer('')} className="flex-1 justify-center cursor-pointer py-3.5">
//                     🗑️ Clear answer
//                   </Button>
//                 </div>
//               </Motion.div>
//             </div>
//           </div>
//         )}
//       </div>
//     </Motion.div>
//   )
// }

// export default Interview

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import Loader from '../components/common/Loader'
import { startInterview, submitAnswer } from '../utils/api'

const interviewTypes = [
  { value: 'technical', label: 'Technical', icon: '💻', description: 'Coding, algorithms, system design' },
  { value: 'behavioral', label: 'Behavioral', icon: '🗣️', description: 'Past experiences, teamwork, leadership' },
  { value: 'hr', label: 'HR', icon: '👥', description: 'Company fit, career goals' },
  { value: 'domain_specific', label: 'Domain specific', icon: '🎯', description: 'Industry-specific knowledge' },
]

const difficultyOptions = [
  { value: 'beginner', label: 'Beginner', color: 'emerald', description: 'Basic concepts' },
  { value: 'intermediate', label: 'Intermediate', color: 'blue', description: 'Practical scenarios' },
  { value: 'advanced', label: 'Advanced', color: 'purple', description: 'Complex problems' },
]

function Interview() {
  const navigate = useNavigate()
  const [stage, setStage] = useState('setup')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(0)
  const [session, setSession] = useState(null)
  const [question, setQuestion] = useState(null)
  const [answer, setAnswer] = useState('')
  const [hoveredType, setHoveredType] = useState(null)
  const [hoveredDifficulty, setHoveredDifficulty] = useState(null)
  // ✅ Track current question number
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1)
  const [form, setForm] = useState({
    user_id: 'student_demo',
    job_role: '',
    interview_type: 'technical',
    difficulty: 'intermediate',
    tech_stack: '',
    resume_text: '',
    target_companies: '',
  })
  const timerRef = useRef(null)

  useEffect(() => {
    if (stage === 'live') {
      timerRef.current = window.setInterval(() => setTimer((previous) => previous + 1), 1000)
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current)
      }
    }
  }, [stage, question?.question_id])

  const formattedTime = useMemo(() => {
    const minutes = String(Math.floor(timer / 60)).padStart(2, '0')
    const seconds = String(timer % 60).padStart(2, '0')
    return `${minutes}:${seconds}`
  }, [timer])

  // ✅ Progress percentage calculate karo
  const progressPercent = useMemo(() => {
    if (!session?.total_questions) return 0
    return Math.min((currentQuestionNumber / session.total_questions) * 100, 100)
  }, [currentQuestionNumber, session?.total_questions])

  const handleStartInterview = async () => {
    if (!form.job_role.trim()) {
      setError('✨ Add your target job role to start the interview.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const payload = {
        ...form,
        tech_stack: form.tech_stack ? form.tech_stack.split(',').map((item) => item.trim()).filter(Boolean) : undefined,
        target_companies: form.target_companies ? form.target_companies.split(',').map((item) => item.trim()).filter(Boolean) : undefined,
        resume_text: form.resume_text || undefined,
      }

      const response = await startInterview(payload)
      setSession(response)
      setQuestion(response.first_question)
      setStage('live')
      setTimer(0)
      setCurrentQuestionNumber(1) // ✅ Reset to 1 on new interview
      window.localStorage.setItem('hilearn_session_id', response.session_id)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!answer.trim() || !session || !question) {
      setError('✍️ Write your answer before sending it for feedback.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const response = await submitAnswer({
        session_id: session.session_id,
        question_id: question.question_id,
        answer_text: answer,
        answer_duration_seconds: timer,
      })

      window.localStorage.setItem('hilearn_latest_score', String(response.feedback.overall_score))
      window.localStorage.setItem('hilearn_feedback', JSON.stringify(response))

      if (response.next_question) {
        // ✅ Next question dikhao aur counter badao
        setQuestion(response.next_question)
        setAnswer('')
        setTimer(0)
        setCurrentQuestionNumber((prev) => prev + 1)
        if (timerRef.current) window.clearInterval(timerRef.current)
      } else {
        // ✅ Sab questions ho gaye — feedback pe jao
        if (timerRef.current) window.clearInterval(timerRef.current)
        navigate('/feedback', {
          state: { feedbackResponse: response, session },
        })
      }
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading && stage === 'setup') {
    return <Loader label="🎯 Starting your interview room..." />
  }

  return (
    <Motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-100 py-14 px-4"
    >
      <div className="max-w-7xl mx-auto">

        {stage === 'setup' && (
          <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">

            {/* Left Section - Info */}
            <div className="space-y-6">
              <Motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 p-8 text-white shadow-xl shadow-blue-500/30"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-100">
                  🎙️ Interview lab
                </p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight">
                  Step into a calm, realistic practice room.
                </h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-blue-100">
                  Choose your interview type, role, and difficulty, then launch a backend-connected session with the first live AI question.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    { emoji: '🎯', text: 'Role setup' },
                    { emoji: '💬', text: 'Live question flow' },
                    { emoji: '📊', text: 'Feedback after each answer' },
                  ].map((item) => (
                    <div key={item.text} className="rounded-xl bg-white/15 px-4 py-3 text-sm font-medium text-white backdrop-blur-sm">
                      {item.emoji} {item.text}
                    </div>
                  ))}
                </div>
              </Motion.div>

              <Motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="rounded-2xl border border-blue-200 bg-white p-6 shadow-lg shadow-blue-200/50"
              >
                <p className="text-sm font-semibold text-gray-900">🔌 What this setup connects to</p>
                <div className="mt-4 space-y-3">
                  {[
                    'Starts real interview sessions from FastAPI',
                    'Submits typed answers to the existing feedback endpoint',
                    'Stores only lightweight session context in localStorage',
                  ].map((item, idx) => (
                    <Motion.div
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + idx * 0.1 }}
                      className="flex items-center gap-3 text-sm text-gray-600"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs">✓</span>
                      <span>{item}</span>
                    </Motion.div>
                  ))}
                </div>
              </Motion.div>

              <Motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="rounded-2xl bg-gradient-to-r from-blue-50 to-white p-6 border border-blue-200"
              >
                <p className="text-sm font-semibold text-blue-600">💡 Pro Tips for Success</p>
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-gray-600">• Be specific with your tech stack and target companies</p>
                  <p className="text-sm text-gray-600">• Use STAR method (Situation, Task, Action, Result)</p>
                  <p className="text-sm text-gray-600">• Practice speaking clearly and concisely</p>
                </div>
              </Motion.div>

              <Motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="rounded-2xl bg-white p-6 border border-blue-200 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="text-center flex-1">
                    <p className="text-2xl font-bold text-blue-600">10K+</p>
                    <p className="text-xs text-gray-500">Interviews Completed</p>
                  </div>
                  <div className="w-px h-8 bg-gray-200" />
                  <div className="text-center flex-1">
                    <p className="text-2xl font-bold text-blue-600">92%</p>
                    <p className="text-xs text-gray-500">Confidence Boost</p>
                  </div>
                  <div className="w-px h-8 bg-gray-200" />
                  <div className="text-center flex-1">
                    <p className="text-2xl font-bold text-blue-600">4.9</p>
                    <p className="text-xs text-gray-500">Student Rating</p>
                  </div>
                </div>
              </Motion.div>
            </div>

            {/* Right Section - Form */}
            <Motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-blue-200 bg-white p-8 shadow-xl shadow-blue-200/50"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">🎮 Interview Setup</h2>
              <p className="text-sm text-gray-500 mb-6">Fill in the details to get personalized questions</p>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-medium text-gray-700">🎯 Target role <span className="text-red-500">*</span></span>
                  <input
                    value={form.job_role}
                    onChange={(event) => setForm((previous) => ({ ...previous, job_role: event.target.value }))}
                    placeholder="e.g., Frontend Developer, Data Analyst, SDE Intern"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">📋 Interview type</span>
                  <div className="grid grid-cols-2 gap-2">
                    {interviewTypes.map((item) => (
                      <Motion.div
                        key={item.value}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setForm((prev) => ({ ...prev, interview_type: item.value }))}
                        onMouseEnter={() => setHoveredType(item.value)}
                        onMouseLeave={() => setHoveredType(null)}
                        className={`cursor-pointer rounded-xl border p-3 text-center transition-all duration-200 ${form.interview_type === item.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                      >
                        <span className="text-xl block mb-1">{item.icon}</span>
                        <span className="text-sm font-medium">{item.label}</span>
                        {hoveredType === item.value && (
                          <p className="text-xs text-gray-400 mt-1">{item.description}</p>
                        )}
                      </Motion.div>
                    ))}
                  </div>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">⚡ Difficulty</span>
                  <div className="flex gap-2">
                    {difficultyOptions.map((item) => (
                      <Motion.div
                        key={item.value}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setForm((prev) => ({ ...prev, difficulty: item.value }))}
                        onMouseEnter={() => setHoveredDifficulty(item.value)}
                        onMouseLeave={() => setHoveredDifficulty(null)}
                        className={`flex-1 cursor-pointer rounded-xl border p-3 text-center transition-all duration-200 ${form.difficulty === item.value
                          ? `border-${item.color}-500 bg-${item.color}-50 text-${item.color}-700`
                          : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                      >
                        <span className="text-sm font-medium">{item.label}</span>
                        {hoveredDifficulty === item.value && (
                          <p className="text-xs text-gray-400 mt-1">{item.description}</p>
                        )}
                      </Motion.div>
                    ))}
                  </div>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">🛠️ Tech stack</span>
                  <input
                    value={form.tech_stack}
                    onChange={(event) => setForm((previous) => ({ ...previous, tech_stack: event.target.value }))}
                    placeholder="React, Python, Java, AWS (comma separated)"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">🏢 Target companies</span>
                  <input
                    value={form.target_companies}
                    onChange={(event) => setForm((previous) => ({ ...previous, target_companies: event.target.value }))}
                    placeholder="Google, Microsoft, Amazon, TCS (comma separated)"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </label>

                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-medium text-gray-700">📄 Resume summary (optional)</span>
                  <textarea
                    rows={3}
                    value={form.resume_text}
                    onChange={(event) => setForm((previous) => ({ ...previous, resume_text: event.target.value }))}
                    placeholder="Paste a short summary of your experience, skills, and projects to help personalize the session..."
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  />
                  <p className="text-xs text-gray-400">This helps AI generate more relevant questions for your background</p>
                </label>
              </div>

              {error && (
                <Motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700"
                >
                  {error}
                </Motion.div>
              )}

              <Button onClick={handleStartInterview} className="mt-6 w-full cursor-pointer justify-center py-3.5 text-base">
                🚀 Start interview
              </Button>
            </Motion.div>
          </div>
        )}

        {/* Live Interview Stage */}
        {stage === 'live' && session && question && (
          <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">

            {/* Left Sidebar */}
            <Motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="rounded-2xl bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 p-6 text-white shadow-xl shadow-blue-500/30">
                <p className="text-xs uppercase tracking-[0.24em] text-blue-100">📋 Session</p>
                <h2 className="mt-3 text-2xl font-bold">{session.job_role}</h2>
                <div className="mt-4 flex flex-wrap gap-2 text-sm">
                  <span className="rounded-full bg-white/20 px-3 py-1 capitalize">{session.interview_type}</span>
                  <span className="rounded-full bg-white/20 px-3 py-1 capitalize">{session.difficulty}</span>
                  <span className="rounded-full bg-white/20 px-3 py-1">{session.total_questions} questions</span>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-200 bg-white p-6 shadow-lg shadow-blue-200/50">
                <p className="text-sm text-gray-500">⏱️ Elapsed answer time</p>
                <p className="mt-2 text-5xl font-bold text-blue-600">{formattedTime}</p>
                <div className="mt-4 h-2 w-full rounded-full bg-gray-100">
                  <Motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(timer / 300) * 100}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                  />
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-500">
                  🎙️ Voice input is coming soon! Type your answer below for now.
                </p>
              </div>

              {/* ✅ Progress Indicator - Ab sahi se update hoga */}
              <div className="rounded-2xl border border-blue-200 bg-white p-6 shadow-lg shadow-blue-200/50">
                <p className="text-sm font-semibold text-gray-700">📊 Session Progress</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-gray-100">
                    <Motion.div
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full rounded-full bg-blue-600"
                    />
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    Question {currentQuestionNumber}/{session.total_questions}
                  </span>
                </div>
                {/* ✅ Completed dots */}
                <div className="mt-3 flex gap-1">
                  {Array.from({ length: session.total_questions }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 flex-1 rounded-full transition-all duration-300 ${idx < currentQuestionNumber ? 'bg-blue-500' : 'bg-gray-200'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Answer Tips */}
              <div className="rounded-2xl border border-blue-200 bg-blue-50/30 p-6 shadow-sm">
                <p className="text-sm font-semibold text-blue-700">📝 Answer Tips</p>
                <ul className="mt-2 space-y-1 text-xs text-gray-600">
                  <li>• Use specific examples from your experience</li>
                  <li>• Structure your answer clearly</li>
                  <li>• Be honest and authentic</li>
                </ul>
              </div>
            </Motion.div>

            {/* Right Section - Question & Answer */}
            <div className="space-y-6">
              <Motion.div
                key={question.question_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-blue-200 bg-white p-7 shadow-lg shadow-blue-200/50"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
                      🤖 AI interviewer
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                      Question {currentQuestionNumber}
                    </h1>
                  </div>
                  <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                    {question.topic || 'Live round'}
                  </div>
                </div>
                <div className="mt-6 rounded-xl bg-gray-50 p-6 border border-gray-200">
                  <p className="text-lg leading-8 text-gray-800">{question.question_text}</p>
                </div>
              </Motion.div>

              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl border border-blue-200 bg-white p-7 shadow-lg shadow-blue-200/50"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">✍️ Your answer</h2>
                    <p className="mt-1 text-sm text-gray-500">Type naturally or use the voice CTA as a guided input surface.</p>
                  </div>
                  <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                    {answer.trim() ? `${answer.trim().split(/\s+/).length} words` : '0 words'}
                  </span>
                </div>

                <textarea
                  rows={10}
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  placeholder="Structure your answer with examples, context, actions, and outcomes..."
                  className="mt-5 w-full rounded-xl border border-gray-200 px-5 py-4 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                />

                {error && (
                  <Motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700"
                  >
                    {error}
                  </Motion.div>
                )}

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Button onClick={handleSubmit} className="flex-1 cursor-pointer justify-center py-3.5" disabled={loading}>
                    {loading ? '⏳ Submitting...' : '✨ Submit for AI feedback'}
                  </Button>
                  <Button variant="secondary" onClick={() => setAnswer('')} className="flex-1 justify-center cursor-pointer py-3.5">
                    🗑️ Clear answer
                  </Button>
                </div>
              </Motion.div>
            </div>
          </div>
        )}
      </div>
    </Motion.div>
  )
}

export default Interview