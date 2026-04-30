


// import { useState, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Link } from 'react-router-dom'
// import {
//   CheckCircle, TrendingUp, Mic, ArrowRight,
//   BookOpen, ExternalLink, ChevronDown, ChevronUp,
//   Star, Zap, MessageSquare, BarChart3
// } from 'lucide-react'
// // import { useState } from 'react'
// // import { motion } from 'framer-motion'
// // import { Link } from 'react-router-dom'
// import { Award, BarChart3, CheckCircle, ArrowRight, Mic, Clock, Zap, Mail, Loader } from 'lucide-react'
// import { sendResultsEmail } from '../../utils/api'

// const LMS_URL = 'https://hilearn-lms-tool.vercel.app/courses'

// function getLMSRec(score, improvements = [], jobRole = '') {
//   const text = (improvements.join(' ') + ' ' + jobRole).toLowerCase()
//   if (text.includes('data science') || text.includes('data analyst'))
//     return { tag: 'Data Science', title: 'Data Science & Analytics Masterclass', desc: 'Python, SQL, ML and visualization — placement-ready curriculum', accent: '#6366f1' }
//   if (text.includes('machine learning') || text.includes(' ml ') || text.includes(' ai ') || text.includes('deep learning'))
//     return { tag: 'AI / ML', title: 'AI & Machine Learning Bootcamp', desc: 'Transformers, LLMs, model deployment — industry-level AI skills', accent: '#0ea5e9' }
//   if (text.includes('marketing') || text.includes('digital') || text.includes('seo'))
//     return { tag: 'Digital Marketing', title: 'Digital Marketing Certification', desc: 'SEO, paid ads, content strategy and analytics — become a full-stack marketer', accent: '#f59e0b' }
//   if (text.includes('data') || text.includes('analytics') || text.includes('sql'))
//     return { tag: 'Data Analytics', title: 'Data Analytics with Python & SQL', desc: 'Strengthen your analytics skills with real-world projects', accent: '#6366f1' }
//   if (score >= 8)
//     return { tag: 'Advanced', title: 'Advanced Interview Preparation Bundle', desc: 'System design, leadership rounds & executive communication', accent: '#10b981' }
//   if (score >= 5)
//     return { tag: 'Intermediate', title: 'Core Interview Skills Program', desc: 'Improve DSA, system design basics & communication clarity', accent: '#c8601a' }
//   return { tag: 'Foundation', title: 'Interview Prep Foundation Course', desc: 'Start with communication, problem-solving & core technical concepts', accent: '#c8601a' }
// }

// function ScoreRing({ score, max = 10 }) {
//   const [val, setVal] = useState(0)
//   const r = 44, circ = 2 * Math.PI * r
//   const pct = Math.min(score / max, 1)
//   const color = score >= 8 ? '#10b981' : score >= 5 ? '#c8601a' : score > 0 ? '#ef4444' : '#d1cdc7'
//   const label = score >= 8 ? 'Excellent!' : score >= 5 ? 'Good Job!' : score > 0 ? 'Keep Going!' : 'No data yet'

//   useEffect(() => {
//     if (!score) return
//     let start = null
//     const run = ts => {
//       if (!start) start = ts
//       const p = Math.min((ts - start) / 1200, 1)
//       setVal(+(score * p).toFixed(1))
//       if (p < 1) requestAnimationFrame(run)
//     }
//     requestAnimationFrame(run)
//   }, [score])

//   // Email state
//   const [sendingEmail, setSendingEmail] = useState(false)
//   const [emailSent, setEmailSent] = useState(false)
//   const [emailError, setEmailError] = useState('')

//   const sessionId = completeFeedback?.session_id || localStorage.getItem('hilearn_session_id') || ''

//   const handleSendEmail = async () => {
//     if (!sessionId) {
//       setEmailError('No session found to send results for.')
//       return
//     }
//     setSendingEmail(true)
//     setEmailError('')
//     try {
//       await sendResultsEmail(sessionId)
//       setEmailSent(true)
//     } catch (err) {
//       setEmailError(err.message || 'Failed to send email.')
//     } finally {
//       setSendingEmail(false)
//     }
//   }

//   return (
//     <div className="flex flex-col items-center gap-2">
//       <div className="relative" style={{ width: 120, height: 120 }}>
//         <svg viewBox="0 0 110 110" style={{ width: 120, height: 120, transform: 'rotate(-90deg)' }}>
//           <circle cx="55" cy="55" r={r} fill="none" stroke="#f0ede9" strokeWidth="9" />
//           <motion.circle cx="55" cy="55" r={r} fill="none"
//             stroke={color} strokeWidth="9" strokeLinecap="round"
//             strokeDasharray={circ}
//             initial={{ strokeDashoffset: circ }}
//             animate={{ strokeDashoffset: circ - circ * pct }}
//             transition={{ duration: 1.2, ease: 'easeOut' }}
//           />
//         </svg>
//         <div className="absolute inset-0 flex flex-col items-center justify-center">
//           <span className="text-3xl font-bold text-[#0f1f3d]">{val > 0 ? val : score > 0 ? score : '—'}</span>
//           <span className="text-xs text-[#9c9a96]">/ {max}</span>
//         </div>
//       </div>
//       <span className="text-sm font-bold" style={{ color }}>{label}</span>
//     </div>
//   )
// }

// function Bar({ label, value, max = 10, color = '#c8601a', delay = 0 }) {
//   if (value == null) return null
//   return (
//     <div className="space-y-1.5">
//       <div className="flex justify-between items-center">
//         <span className="text-xs text-[#5c5a57]">{label}</span>
//         <span className="text-xs font-bold text-[#0f1f3d]">{value}/{max}</span>
//       </div>
//       <div className="h-2 rounded-full bg-[#f0ede9] overflow-hidden">
//         <motion.div className="h-full rounded-full" style={{ background: color }}
//           initial={{ width: 0 }}
//           animate={{ width: `${(value / max) * 100}%` }}
//           transition={{ duration: 1, ease: 'easeOut', delay }}
//         />
//       </div>
//     </div>
//   )
// }

// export default function UserFeedback() {
//   const [hintOpen, setHintOpen] = useState(false)

//   // hilearn_complete_feedback = full SubmitAnswerResponse
//   // { session_id, feedback: { overall_score, content_score, strengths, improvements, ... }, questions_answered, ... }
//   const raw = JSON.parse(localStorage.getItem('hilearn_complete_feedback') || 'null')
//   const latest = JSON.parse(localStorage.getItem('hilearn_latest_feedback') || 'null')
//   const session = JSON.parse(localStorage.getItem('hilearn_interview_session') || 'null')

//   const fb = raw?.feedback || raw || latest || {}

//   const score = fb.overall_score ?? 0
//   const cScore = fb.content_score ?? null
//   const compScore = fb.completeness_score ?? null
//   const relScore = fb.relevance_score ?? null
//   const strengths = fb.strengths || []
//   const improv = fb.improvements || []
//   const hint = fb.ideal_answer_hint || null
//   const voice = fb.communication || null

//   const jobRole = raw?.job_role || session?.job_role || ''
//   const ivType = raw?.interview_type || session?.interview_type || ''
//   const totalQ = raw?.questions_answered || raw?.total_questions || null

//   const hasData = score > 0
//   const rec = getLMSRec(score, improv, jobRole)

//   return (
//     <div className="space-y-5">

//       {/* Header */}
//       <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
//         className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
//       >
//         <div>
//           <p className="text-xs uppercase tracking-[0.2em] text-[#c8601a] font-semibold">Interview Complete</p>
//           <h1 className="text-3xl font-bold text-[#0f1f3d] mt-1">Your Feedback</h1>
//           {(jobRole || ivType || totalQ) && (
//             <p className="text-sm text-[#9c9a96] mt-1">
//               {[jobRole, ivType, totalQ ? `${totalQ} questions` : null].filter(Boolean).join(' · ')}
//             </p>
//           )}
//           {!hasData && (
//             <p className="mt-2 text-sm text-[#9c9a96] bg-[#f9f7f4] border border-[#f0ede9] px-4 py-2 rounded-xl inline-block">
//               Complete an interview to see your real feedback
//             </p>
//           )}
//         </div>
//         <Link to="/user/interview-setup"
//           className="inline-flex items-center gap-2 bg-[#c8601a] text-white font-bold px-5 py-3 rounded-full shadow-lg shadow-[#c8601a]/20 hover:bg-[#b0541a] transition text-sm self-start whitespace-nowrap"
//         >
//           <Zap size={15} /> Practice Again
//         </Link>
//       </motion.div>

//       {/* Score + Breakdown — full width 2 col */}
//       <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5">
//         <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
//           className="surface-card p-6 flex flex-col items-center justify-center gap-1"
//         >
//           <ScoreRing score={score} />
//           <p className="text-xs text-[#9c9a96] uppercase tracking-widest mt-1">Overall Score</p>
//         </motion.div>

//         <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
//           className="surface-card p-6 flex flex-col justify-center"
//         >
//           <h3 className="text-sm font-bold text-[#0f1f3d] flex items-center gap-2 mb-4">
//             <BarChart3 size={15} className="text-[#c8601a]" /> Score Breakdown
//           </h3>
//           {(cScore != null || compScore != null || relScore != null) ? (
//             <div className="space-y-3.5">
//               <Bar label="Content Quality" value={cScore} color="#c8601a" delay={0.2} />
//               <Bar label="Completeness" value={compScore} color="#6366f1" delay={0.3} />
//               <Bar label="Relevance" value={relScore} color="#10b981" delay={0.4} />
//             </div>
//           ) : (
//             <p className="text-sm text-[#9c9a96]">
//               {hasData ? 'Detailed breakdown will appear in your next interview.' : 'Complete an interview to see the breakdown here.'}
//             </p>
//           )}
//         </motion.div>
//       </div>

//       {/* Strengths + Improve */}
//       <div className="grid md:grid-cols-2 gap-5">
//         <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
//           className="surface-card p-6"
//         >
//           <h2 className="font-bold text-[#0f1f3d] mb-4 flex items-center gap-2">
//             <CheckCircle size={16} className="text-green-500" /> Strengths
//           </h2>
//           {strengths.length > 0 ? (
//             <ul className="space-y-2.5">
//               {strengths.map((s, i) => (
//                 <motion.li key={i}
//                   initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.07 }}
//                   className="flex items-start gap-2.5 text-sm text-[#5c5a57]"
//                 >
//                   <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
//                   {s}
//                 </motion.li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-sm text-[#9c9a96]">Will appear after you take an interview.</p>
//           )}
//         </motion.div>

//         <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
//           className="surface-card p-6"
//         >
//           <h2 className="font-bold text-[#0f1f3d] mb-4 flex items-center gap-2">
//             <TrendingUp size={16} className="text-[#c8601a]" /> Areas to Improve
//           </h2>
//           {improv.length > 0 ? (
//             <ul className="space-y-2.5">
//               {improv.map((s, i) => (
//                 <motion.li key={i}
//                   initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.07 }}
//                   className="flex items-start gap-2.5 text-sm text-[#5c5a57]"
//                 >
//                   <span className="w-1.5 h-1.5 rounded-full bg-[#c8601a] mt-2 flex-shrink-0" />
//                   {s}
//                 </motion.li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-sm text-[#9c9a96]">Will appear after you take an interview.</p>
//           )}
//         </motion.div>
//       </div>

//       {/* Voice + Hint */}
//       {(voice || hint) && (
//         <div className={`grid gap-5 ${voice && hint ? 'md:grid-cols-2' : ''}`}>
//           {voice && (
//             <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
//               className="surface-card p-6"
//             >
//               <h2 className="font-bold text-[#0f1f3d] mb-4 flex items-center gap-2">
//                 <Mic size={16} className="text-[#c8601a]" /> Voice Analysis
//               </h2>
//               <div className="grid grid-cols-3 gap-3 mb-4">
//                 {voice.speaking_pace_wpm != null && (
//                   <div className="text-center p-3 bg-[#f9f7f4] rounded-xl">
//                     <p className="text-xl font-bold text-[#0f1f3d]">{voice.speaking_pace_wpm}</p>
//                     <p className="text-xs text-[#9c9a96] mt-1">Words/min</p>
//                   </div>
//                 )}
//                 {voice.filler_words_count != null && (
//                   <div className="text-center p-3 bg-[#f9f7f4] rounded-xl">
//                     <p className="text-xl font-bold text-[#0f1f3d]">{voice.filler_words_count}</p>
//                     <p className="text-xs text-[#9c9a96] mt-1">Filler words</p>
//                   </div>
//                 )}
//                 {voice.confidence_score != null && (
//                   <div className="text-center p-3 bg-[#f9f7f4] rounded-xl">
//                     <p className="text-xl font-bold text-[#0f1f3d]">{Math.round(voice.confidence_score * 10)}%</p>
//                     <p className="text-xs text-[#9c9a96] mt-1">Confidence</p>
//                   </div>
//                 )}
//               </div>
//               <div className="space-y-2.5">
//                 <Bar label="Clarity" value={voice.clarity_score != null ? +voice.clarity_score.toFixed(1) : null} color="#10b981" />
//                 <Bar label="Confidence" value={voice.confidence_score != null ? +voice.confidence_score.toFixed(1) : null} color="#6366f1" />
//               </div>
//               {voice.filler_words_detected?.length > 0 && (
//                 <p className="text-xs text-[#9c9a96] mt-3">
//                   Filler words: <span className="text-[#c8601a] font-medium">{voice.filler_words_detected.join(', ')}</span>
//                 </p>
//               )}
//             </motion.div>
//           )}

//           {hint && (
//             <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
//               className="surface-card overflow-hidden"
//             >
//               <button onClick={() => setHintOpen(o => !o)}
//                 className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#f9f7f4] transition text-left"
//               >
//                 <span className="flex items-center gap-2 font-bold text-[#0f1f3d] text-sm">
//                   <MessageSquare size={15} className="text-[#c8601a]" /> Ideal Answer Hint
//                 </span>
//                 {hintOpen ? <ChevronUp size={15} className="text-[#9c9a96]" /> : <ChevronDown size={15} className="text-[#9c9a96]" />}
//               </button>
//               <AnimatePresence>
//                 {hintOpen && (
//                   <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
//                     exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
//                     className="border-t border-[#f0ede9]"
//                   >
//                     <p className="px-6 py-4 text-sm text-[#5c5a57] leading-relaxed">{hint}</p>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </motion.div>
//           )}
//         </div>
//       )}

//       {/* LMS Banner — full width */}
//       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
//         className="rounded-2xl overflow-hidden border border-[#e8e4df]"
//       {/* CTA Buttons */}
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.35 }}
//         className="flex flex-wrap gap-3"
//       >
//         <div className="flex items-center gap-2 px-6 py-2.5" style={{ background: rec.accent }}>
//           <BookOpen size={14} className="text-white" />
//           <span className="text-white text-xs font-bold tracking-wider uppercase">HiLearn Academy — Recommended for you</span>
//         </div>

//         <div className="p-6" style={{ background: `linear-gradient(135deg, ${rec.accent}08 0%, #fff 60%)` }}>
//           <div className="flex flex-col sm:flex-row sm:items-start gap-5">
//             <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
//               style={{ background: rec.accent + '15' }}>
//               <BookOpen size={24} style={{ color: rec.accent }} />
//             </div>

//             <div className="flex-1 min-w-0">
//               <span className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mb-2"
//                 style={{ background: rec.accent + '18', color: rec.accent }}>
//                 {rec.tag}
//               </span>
//               <h3 className="font-bold text-[#0f1f3d] text-base">{rec.title}</h3>
//               <p className="text-sm text-[#5c5a57] mt-1">{rec.desc}</p>
//               <div className="flex items-center gap-3 mt-2.5">
//                 <div className="flex gap-0.5">
//                   {[1, 2, 3, 4, 5].map(i => <Star key={i} size={11} fill={rec.accent} color={rec.accent} />)}
//                 </div>
//                 <span className="text-xs text-[#9c9a96]">HiLearn certified · Self-paced</span>
//               </div>
//             </div>

//             <a href={LMS_URL} target="_blank" rel="noopener noreferrer"
//               className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white flex-shrink-0 self-start transition-all hover:opacity-90 hover:scale-105"
//               style={{ background: rec.accent }}
//             >
//               View Course <ExternalLink size={14} />
//             </a>
//           </div>

//           <div className="mt-4 pt-4 border-t border-[#f0ede9] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
//             <p className="text-xs text-[#9c9a96]">
//               {hasData
//                 ? score < 5 ? '💡 Best way to improve your score — take structured learning'
//                   : score < 8 ? '📈 Good start! Strengthen your skills further with this course'
//                     : '🏆 Excellent! Explore advanced topics'
//                 : '📚 Structured learning is essential alongside interview prep'}
//             </p>
//             <a href={LMS_URL} target="_blank" rel="noopener noreferrer"
//               className="text-xs font-semibold flex items-center gap-1 whitespace-nowrap hover:opacity-70 transition"
//               style={{ color: rec.accent }}
//             >
//               View all courses <ExternalLink size={11} />
//             </a>
//           </div>
//         </div>
//       </motion.div>

//       {/* CTAs */}
//       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
//         className="flex gap-3 flex-wrap"
//       >
//         <Link to="/user/interview-setup"
//           className="flex-1 flex items-center justify-center gap-2 bg-[#c8601a] text-white py-3.5 rounded-full font-bold shadow-lg shadow-[#c8601a]/20 hover:bg-[#b0541a] transition min-w-[160px]"
//         >
//           <Zap size={16} /> Practice Again
//         </Link>
//         <Link to="/user"
//           className="px-6 py-3.5 border-2 border-[#e0dbd3] rounded-full font-semibold text-[#5c5a57] hover:border-[#c8601a]/50 transition"
//         {hasRealData && sessionId && (
//           <button
//             onClick={handleSendEmail}
//             disabled={sendingEmail || emailSent}
//             className="flex items-center justify-center gap-2 px-6 py-4 bg-[#0f1f3d] text-white rounded-full font-bold hover:bg-[#1a3a6b] transition disabled:opacity-60"
//           >
//             {sendingEmail ? (
//               <><Loader size={14} className="animate-spin" /> Sending...</>
//             ) : emailSent ? (
//               <><CheckCircle size={14} /> Sent ✉️</>
//             ) : (
//               <><Mail size={14} /> Email Results</>
//             )}
//           </button>
//         )}
//         <Link
//           to="/user"
//           className="px-6 py-4 border-2 border-[#e0dbd3] rounded-full font-semibold text-[#5c5a57] hover:border-[#c8601a]/50 transition"
//         >
//           Dashboard
//         </Link>
//         <a href={LMS_URL} target="_blank" rel="noopener noreferrer"
//           className="flex items-center gap-2 px-5 py-3.5 rounded-full font-semibold text-sm border-2 transition hover:opacity-80"
//           style={{ borderColor: rec.accent + '60', color: rec.accent }}
//         >
//           <BookOpen size={15} /> HiLearn Courses
//         </a>
//       </motion.div>

//       {emailError && (
//         <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-2">
//           {emailError}
//         </p>
//       )}
//       {emailSent && (
//         <p className="text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2">
//           ✅ Results sent to your registered email!
//         </p>
//       )}
//     </div>
//   )
// } 




import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  CheckCircle, TrendingUp, Mic, ArrowRight,
  BookOpen, ExternalLink, ChevronDown, ChevronUp,
  Star, Zap, MessageSquare, BarChart3, Award, Clock, Mail, Loader, Share2, Copy
} from 'lucide-react';
import { sendResultsEmail, generateShareLink } from '../../utils/api';
import useScoreCelebration from '../../hooks/useScoreCelebration';

const LMS_URL = 'https://hilearn-lms-tool.vercel.app/courses';

function getLMSRec(score, improvements = [], jobRole = '') {
  const text = (improvements.join(' ') + ' ' + jobRole).toLowerCase();
  if (text.includes('data science') || text.includes('data analyst'))
    return { tag: 'Data Science', title: 'Data Science & Analytics Masterclass', desc: 'Python, SQL, ML and visualization — placement-ready curriculum', accent: '#6366f1' };
  if (text.includes('machine learning') || text.includes(' ml ') || text.includes(' ai ') || text.includes('deep learning'))
    return { tag: 'AI / ML', title: 'AI & Machine Learning Bootcamp', desc: 'Transformers, LLMs, model deployment — industry-level AI skills', accent: '#0ea5e9' };
  if (text.includes('marketing') || text.includes('digital') || text.includes('seo'))
    return { tag: 'Digital Marketing', title: 'Digital Marketing Certification', desc: 'SEO, paid ads, content strategy and analytics — become a full-stack marketer', accent: '#f59e0b' };
  if (text.includes('data') || text.includes('analytics') || text.includes('sql'))
    return { tag: 'Data Analytics', title: 'Data Analytics with Python & SQL', desc: 'Strengthen your analytics skills with real-world projects', accent: '#6366f1' };
  if (score >= 8)
    return { tag: 'Advanced', title: 'Advanced Interview Preparation Bundle', desc: 'System design, leadership rounds & executive communication', accent: '#10b981' };
  if (score >= 5)
    return { tag: 'Intermediate', title: 'Core Interview Skills Program', desc: 'Improve DSA, system design basics & communication clarity', accent: '#c8601a' };
  return { tag: 'Foundation', title: 'Interview Prep Foundation Course', desc: 'Start with communication, problem-solving & core technical concepts', accent: '#c8601a' };
}

function ScoreRing({ score, max = 10 }) {
  const [val, setVal] = useState(0);
  const r = 44, circ = 2 * Math.PI * r;
  const pct = Math.min(score / max, 1);
  const color = score >= 8 ? '#10b981' : score >= 5 ? '#c8601a' : score > 0 ? '#ef4444' : '#d1cdc7';
  const label = score >= 8 ? 'Excellent!' : score >= 5 ? 'Good Job!' : score > 0 ? 'Keep Going!' : 'No data yet';

  useEffect(() => {
    if (!score) return;
    let start = null;
    const run = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1200, 1);
      setVal(+(score * p).toFixed(1));
      if (p < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: 120, height: 120 }}>
        <svg viewBox="0 0 110 110" style={{ width: 120, height: 120, transform: 'rotate(-90deg)' }}>
          <circle cx="55" cy="55" r={r} fill="none" stroke="#f0ede9" strokeWidth="9" />
          <motion.circle cx="55" cy="55" r={r} fill="none"
            stroke={color} strokeWidth="9" strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - circ * pct }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-[#0f1f3d]">{val > 0 ? val : score > 0 ? score : '—'}</span>
          <span className="text-xs text-[#9c9a96]">/ {max}</span>
        </div>
      </div>
      <span className="text-sm font-bold" style={{ color }}>{label}</span>
    </div>
  );
}

function Bar({ label, value, max = 10, color = '#c8601a', delay = 0 }) {
  if (value == null) return null;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-[#5c5a57]">{label}</span>
        <span className="text-xs font-bold text-[#0f1f3d]">{value}/{max}</span>
      </div>
      <div className="h-2 rounded-full bg-[#f0ede9] overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay }}
        />
      </div>
    </div>
  );
}

export default function UserFeedback() {
  const [hintOpen, setHintOpen] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const raw = JSON.parse(localStorage.getItem('hilearn_complete_feedback') || 'null');
  const latest = JSON.parse(localStorage.getItem('hilearn_latest_feedback') || 'null');
  const session = JSON.parse(localStorage.getItem('hilearn_interview_session') || 'null');

  const fb = raw?.feedback || raw || latest || {};
  const score = fb.overall_score ?? 0;
  const cScore = fb.content_score ?? null;
  const compScore = fb.completeness_score ?? null;
  const relScore = fb.relevance_score ?? null;
  const strengths = fb.strengths || [];
  const improv = fb.improvements || [];
  const hint = fb.ideal_answer_hint || null;
  const voice = fb.communication || null;

  const jobRole = raw?.job_role || session?.job_role || '';
  const ivType = raw?.interview_type || session?.interview_type || '';
  const totalQ = raw?.questions_answered || raw?.total_questions || null;
  const sessionId = raw?.session_id || localStorage.getItem('hilearn_session_id') || '';
  const hasData = score > 0;
  const rec = getLMSRec(score, improv, jobRole);
  const hasRealData = hasData && !!sessionId;

  // Trigger score celebration (confetti) if score >= 8
  useScoreCelebration(score);

  const handleCopyLink = () => {
    if (!sessionId) return;
    const link = generateShareLink(sessionId);
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendEmail = async () => {
    if (!sessionId) {
      setEmailError('No session found to send results for.');
      return;
    }
    setSendingEmail(true);
    setEmailError('');
    try {
      await sendResultsEmail(sessionId);
      setEmailSent(true);
    } catch (err) {
      setEmailError(err.message || 'Failed to send email.');
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#c8601a] font-semibold">Interview Complete</p>
          <h1 className="text-3xl font-bold text-[#0f1f3d] mt-1">Your Feedback</h1>
          {(jobRole || ivType || totalQ) && (
            <p className="text-sm text-[#9c9a96] mt-1">
              {[jobRole, ivType, totalQ ? `${totalQ} questions` : null].filter(Boolean).join(' · ')}
            </p>
          )}
          {!hasData && (
            <p className="mt-2 text-sm text-[#9c9a96] bg-[#f9f7f4] border border-[#f0ede9] px-4 py-2 rounded-xl inline-block">
              Complete an interview to see your real feedback
            </p>
          )}
        </div>
        <Link to="/user/interview-setup"
          className="inline-flex items-center gap-2 bg-[#c8601a] text-white font-bold px-5 py-3 rounded-full shadow-lg shadow-[#c8601a]/20 hover:bg-[#b0541a] transition text-sm self-start whitespace-nowrap"
        >
          <Zap size={15} /> Practice Again
        </Link>
      </motion.div>

      {/* Score + Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="surface-card p-6 flex flex-col items-center justify-center gap-1"
        >
          <ScoreRing score={score} />
          <p className="text-xs text-[#9c9a96] uppercase tracking-widest mt-1">Overall Score</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
          className="surface-card p-6 flex flex-col justify-center"
        >
          <h3 className="text-sm font-bold text-[#0f1f3d] flex items-center gap-2 mb-4">
            <BarChart3 size={15} className="text-[#c8601a]" /> Score Breakdown
          </h3>
          {(cScore != null || compScore != null || relScore != null) ? (
            <div className="space-y-3.5">
              <Bar label="Content Quality" value={cScore} color="#c8601a" delay={0.2} />
              <Bar label="Completeness" value={compScore} color="#6366f1" delay={0.3} />
              <Bar label="Relevance" value={relScore} color="#10b981" delay={0.4} />
            </div>
          ) : (
            <p className="text-sm text-[#9c9a96]">
              {hasData ? 'Detailed breakdown will appear in your next interview.' : 'Complete an interview to see the breakdown here.'}
            </p>
          )}
        </motion.div>
      </div>

      {/* Strengths + Improve */}
      <div className="grid md:grid-cols-2 gap-5">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="surface-card p-6"
        >
          <h2 className="font-bold text-[#0f1f3d] mb-4 flex items-center gap-2">
            <CheckCircle size={16} className="text-green-500" /> Strengths
          </h2>
          {strengths.length > 0 ? (
            <ul className="space-y-2.5">
              {strengths.map((s, i) => (
                <motion.li key={i}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.07 }}
                  className="flex items-start gap-2.5 text-sm text-[#5c5a57]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                  {s}
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#9c9a96]">Will appear after you take an interview.</p>
          )}
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="surface-card p-6"
        >
          <h2 className="font-bold text-[#0f1f3d] mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-[#c8601a]" /> Areas to Improve
          </h2>
          {improv.length > 0 ? (
            <ul className="space-y-2.5">
              {improv.map((s, i) => (
                <motion.li key={i}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.07 }}
                  className="flex items-start gap-2.5 text-sm text-[#5c5a57]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c8601a] mt-2 flex-shrink-0" />
                  {s}
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#9c9a96]">Will appear after you take an interview.</p>
          )}
        </motion.div>
      </div>

      {/* Voice + Hint */}
      {(voice || hint) && (
        <div className={`grid gap-5 ${voice && hint ? 'md:grid-cols-2' : ''}`}>
          {voice && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="surface-card p-6"
            >
              <h2 className="font-bold text-[#0f1f3d] mb-4 flex items-center gap-2">
                <Mic size={16} className="text-[#c8601a]" /> Voice Analysis
              </h2>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {voice.speaking_pace_wpm != null && (
                  <div className="text-center p-3 bg-[#f9f7f4] rounded-xl">
                    <p className="text-xl font-bold text-[#0f1f3d]">{voice.speaking_pace_wpm}</p>
                    <p className="text-xs text-[#9c9a96] mt-1">Words/min</p>
                  </div>
                )}
                {voice.filler_words_count != null && (
                  <div className="text-center p-3 bg-[#f9f7f4] rounded-xl">
                    <p className="text-xl font-bold text-[#0f1f3d]">{voice.filler_words_count}</p>
                    <p className="text-xs text-[#9c9a96] mt-1">Filler words</p>
                  </div>
                )}
                {voice.confidence_score != null && (
                  <div className="text-center p-3 bg-[#f9f7f4] rounded-xl">
                    <p className="text-xl font-bold text-[#0f1f3d]">{Math.round(voice.confidence_score * 10)}%</p>
                    <p className="text-xs text-[#9c9a96] mt-1">Confidence</p>
                  </div>
                )}
              </div>
              <div className="space-y-2.5">
                <Bar label="Clarity" value={voice.clarity_score != null ? +voice.clarity_score.toFixed(1) : null} color="#10b981" />
                <Bar label="Confidence" value={voice.confidence_score != null ? +voice.confidence_score.toFixed(1) : null} color="#6366f1" />
              </div>
              {voice.filler_words_detected?.length > 0 && (
                <p className="text-xs text-[#9c9a96] mt-3">
                  Filler words: <span className="text-[#c8601a] font-medium">{voice.filler_words_detected.join(', ')}</span>
                </p>
              )}
            </motion.div>
          )}
          {hint && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="surface-card overflow-hidden"
            >
              <button onClick={() => setHintOpen(o => !o)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#f9f7f4] transition text-left"
              >
                <span className="flex items-center gap-2 font-bold text-[#0f1f3d] text-sm">
                  <MessageSquare size={15} className="text-[#c8601a]" /> Ideal Answer Hint
                </span>
                {hintOpen ? <ChevronUp size={15} className="text-[#9c9a96]" /> : <ChevronDown size={15} className="text-[#9c9a96]" />}
              </button>
              <AnimatePresence>
                {hintOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
                    className="border-t border-[#f0ede9]"
                  >
                    <p className="px-6 py-4 text-sm text-[#5c5a57] leading-relaxed">{hint}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      )}

      {/* LMS Banner - Course Recommendation */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="rounded-2xl overflow-hidden border border-[#e8e4df]"
      >
        <div className="flex items-center gap-2 px-6 py-2.5" style={{ background: rec.accent }}>
          <BookOpen size={14} className="text-white" />
          <span className="text-white text-xs font-bold tracking-wider uppercase">HiLearn Academy — Recommended for you</span>
        </div>
        <div className="p-6" style={{ background: `linear-gradient(135deg, ${rec.accent}08 0%, #fff 60%)` }}>
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: rec.accent + '15' }}>
              <BookOpen size={24} style={{ color: rec.accent }} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mb-2"
                style={{ background: rec.accent + '18', color: rec.accent }}>
                {rec.tag}
              </span>
              <h3 className="font-bold text-[#0f1f3d] text-base">{rec.title}</h3>
              <p className="text-sm text-[#5c5a57] mt-1">{rec.desc}</p>
              <div className="flex items-center gap-3 mt-2.5">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={11} fill={rec.accent} color={rec.accent} />)}
                </div>
                <span className="text-xs text-[#9c9a96]">HiLearn certified · Self-paced</span>
              </div>
            </div>
            <a href={LMS_URL} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white flex-shrink-0 self-start transition-all hover:opacity-90 hover:scale-105"
              style={{ background: rec.accent }}
            >
              View Course <ExternalLink size={14} />
            </a>
          </div>
          <div className="mt-4 pt-4 border-t border-[#f0ede9] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-xs text-[#9c9a96]">
              {hasData
                ? score < 5 ? '💡 Best way to improve your score — take structured learning'
                  : score < 8 ? '📈 Good start! Strengthen your skills further with this course'
                    : '🏆 Excellent! Explore advanced topics'
                : '📚 Structured learning is essential alongside interview prep'}
            </p>
            <a href={LMS_URL} target="_blank" rel="noopener noreferrer"
              className="text-xs font-semibold flex items-center gap-1 whitespace-nowrap hover:opacity-70 transition"
              style={{ color: rec.accent }}
            >
              View all courses <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </motion.div>

      {/* CTA Buttons + Email */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="flex flex-wrap gap-3"
      >
        <Link to="/user/interview-setup"
          className="flex-1 flex items-center justify-center gap-2 bg-[#c8601a] text-white py-3.5 rounded-full font-bold shadow-lg shadow-[#c8601a]/20 hover:bg-[#b0541a] transition min-w-[160px]"
        >
          <Zap size={16} /> Practice Again
        </Link>
        {hasRealData && (
          <button
            onClick={handleSendEmail}
            disabled={sendingEmail || emailSent}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-[#0f1f3d] text-white rounded-full font-bold hover:bg-[#1a3a6b] transition disabled:opacity-60"
          >
            {sendingEmail ? (
              <><Loader size={14} className="animate-spin" /> Sending...</>
            ) : emailSent ? (
              <><CheckCircle size={14} /> Sent ✉️</>
            ) : (
              <><Mail size={14} /> Email Results</>
            )}
          </button>
        )}
        <Link
          to="/user"
          className="px-6 py-4 border-2 border-[#e0dbd3] rounded-full font-semibold text-[#5c5a57] hover:border-[#c8601a]/50 transition"
        >
          Dashboard
        </Link>
        
        {hasRealData && (
          <div className="relative">
            <button
              onClick={() => setShowShareOptions(!showShareOptions)}
              className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-[#c8601a] text-[#c8601a] rounded-full font-bold hover:bg-[#c8601a]/10 transition"
            >
              <Share2 size={16} /> Share Result
            </button>
            
            <AnimatePresence>
              {showShareOptions && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-2xl shadow-xl border border-[#e0dbd3] p-2 z-50 flex flex-col gap-1"
                >
                  <button 
                    onClick={handleCopyLink}
                    className="flex items-center gap-3 w-full p-3 hover:bg-[#f9f7f4] rounded-xl transition text-left text-sm font-semibold text-[#0f1f3d]"
                  >
                    {copiedLink ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} className="text-[#5c5a57]" />}
                    {copiedLink ? 'Link Copied!' : 'Copy Share Link'}
                  </button>
                  <a 
                    href={`https://twitter.com/intent/tweet?text=I just scored ${score}/10 on my ${jobRole} mock interview at HiLearn! Check it out: ${generateShareLink(sessionId)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full p-3 hover:bg-[#f9f7f4] rounded-xl transition text-left text-sm font-semibold text-[#1DA1F2]"
                  >
                    <Share2 size={16} /> Share on Twitter
                  </a>
                  <a 
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(generateShareLink(sessionId))}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full p-3 hover:bg-[#f9f7f4] rounded-xl transition text-left text-sm font-semibold text-[#0A66C2]"
                  >
                    <Share2 size={16} /> Share on LinkedIn
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <a href={LMS_URL} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-3.5 rounded-full font-semibold text-sm border-2 transition hover:opacity-80"
          style={{ borderColor: rec.accent + '60', color: rec.accent }}
        >
          <BookOpen size={15} /> HiLearn Courses
        </a>
      </motion.div>

      {emailError && (
        <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-2">
          {emailError}
        </p>
      )}
      {emailSent && (
        <p className="text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2">
          ✅ Results sent to your registered email!
        </p>
      )}
    </div>
  );
}