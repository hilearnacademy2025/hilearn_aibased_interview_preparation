
// import { useState } from 'react'
// import { motion } from 'framer-motion'
// import { useNavigate } from 'react-router-dom'
// import { ChevronRight, Loader } from 'lucide-react'
// import api from '../../utils/api'
// import { useAuth } from '../../context/AuthContext'

// const interviewTypes = [
//   { id: 'technical',  name: 'Technical',   icon: '💻', desc: 'DSA, System Design, Coding' },
//   { id: 'hr',         name: 'HR Round',    icon: '🤝', desc: 'HR, Culture fit' },
//   { id: 'behavioral', name: 'Behavioral',  icon: '🧠', desc: 'STAR method, examples' },
//   { id: 'domain_specific', name: 'Domain', icon: '🎯', desc: 'Role-specific questions' }, // Note: backend expects 'domain_specific'
// ]
// const difficulties = [
//   { id: 'beginner', name: 'Beginner' },
//   { id: 'intermediate', name: 'Intermediate' },
//   { id: 'advanced', name: 'Advanced' },
// ]
// const jobRoles = [
//   'Backend Engineer', 'Frontend Developer', 'Full Stack Engineer',
//   'Data Scientist', 'Product Manager', 'Mobile Developer',
//   'DevOps Engineer', 'QA Engineer',
// ]

// export default function UserInterviewSetup() {
//   const navigate = useNavigate()
//   const { user } = useAuth()  // ✅ Get logged-in user
//   const [formData, setFormData] = useState({
//     jobRole: '', interviewType: 'technical', difficulty: 'intermediate', techStack: '',
//   })
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')

//   const handleStart = async () => {
//     if (!formData.jobRole) { setError('Please select a job role.'); return }
//     if (!user) { setError('You must be logged in to start an interview.'); return }
//     setError('')
//     setLoading(true)
//     try {
//       // ✅ Convert tech_stack string to array (if any)
//       const techStackArray = formData.techStack
//         ? formData.techStack.split(',').map(s => s.trim()).filter(Boolean)
//         : undefined

//       const payload = {
//         user_id: user.user_id,  // ✅ Send authenticated user ID
//         job_role: formData.jobRole,
//         interview_type: formData.interviewType,
//         difficulty: formData.difficulty,
//         tech_stack: techStackArray,
//         resume_text: localStorage.getItem('hilearn_resume_text') || undefined,
//       }
//       const { data } = await api.post('/interview/start-interview', payload)

//       // ✅ Store session in localStorage (matching UserInterview.jsx expectations)
//       localStorage.setItem('hilearn_interview_session', JSON.stringify(data))
//       localStorage.setItem('hilearn_current_question', JSON.stringify(data.first_question))

//       navigate('/user/interview')
//     } catch (err) {
//       setError(err.response?.data?.detail || err.message || 'Failed to start interview. Try again.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="max-w-3xl space-y-6">
//       <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
//         <p className="text-xs uppercase tracking-[0.2em] text-[#c8601a] font-semibold">Practice</p>
//         <h1 className="display-font text-3xl font-bold text-[#0f1f3d] mt-1">Start a New Interview</h1>
//         <p className="text-sm text-[#9c9a96] mt-1">Configure your session and let AI do the rest</p>
//       </motion.div>

//       <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="surface-card p-6 space-y-7">

//         {/* Job Role */}
//         <div>
//           <p className="text-sm font-bold text-[#0f1f3d] mb-3">Target Job Role *</p>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
//             {jobRoles.map(role => (
//               <button key={role} onClick={() => setFormData({ ...formData, jobRole: role })}
//                 className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${formData.jobRole === role ? 'border-[#c8601a] bg-[#c8601a]/8 text-[#c8601a]' : 'border-[#e0dbd3] text-[#5c5a57] hover:border-[#c8601a]/50'}`}>
//                 {role}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Interview Type */}
//         <div>
//           <p className="text-sm font-bold text-[#0f1f3d] mb-3">Interview Type</p>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//             {interviewTypes.map(type => (
//               <button key={type.id} onClick={() => setFormData({ ...formData, interviewType: type.id })}
//                 className={`p-4 rounded-2xl border-2 text-center transition-all ${formData.interviewType === type.id ? 'border-[#c8601a] bg-[#c8601a]/6' : 'border-[#e0dbd3] hover:border-[#c8601a]/40'}`}>
//                 <div className="text-2xl mb-1">{type.icon}</div>
//                 <p className="text-xs font-bold text-[#0f1f3d]">{type.name}</p>
//                 <p className="text-[10px] text-[#9c9a96] mt-0.5">{type.desc}</p>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Difficulty */}
//         <div>
//           <p className="text-sm font-bold text-[#0f1f3d] mb-3">Difficulty Level</p>
//           <div className="flex gap-3">
//             {difficulties.map(d => (
//               <button key={d.id} onClick={() => setFormData({ ...formData, difficulty: d.id })}
//                 className={`flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${formData.difficulty === d.id ? 'border-[#c8601a] bg-[#c8601a]/8 text-[#c8601a]' : 'border-[#e0dbd3] text-[#5c5a57] hover:border-[#c8601a]/40'}`}>
//                 {d.name}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Tech Stack */}
//         <div>
//           <p className="text-sm font-bold text-[#0f1f3d] mb-2">Tech Stack <span className="text-[#9c9a96] font-normal">(optional)</span></p>
//           <input type="text" placeholder="e.g. Python, FastAPI, React, PostgreSQL" value={formData.techStack}
//             onChange={e => setFormData({ ...formData, techStack: e.target.value })}
//             className="warm-input text-sm" />
//           <p className="text-xs text-[#9c9a96] mt-1.5">Comma-separated values. AI will use this to tailor questions.</p>
//         </div>

//         <div className="rounded-2xl bg-[#0f1f3d]/4 border border-[#0f1f3d]/10 px-5 py-4 text-sm text-[#5c5a57]">
//           ⏱️ <strong className="text-[#0f1f3d]">Duration:</strong> 15–25 minutes. You can pause between questions.
//         </div>

//         {error && <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">{error}</p>}

//         <button onClick={handleStart} disabled={loading}
//           className="w-full flex items-center justify-center gap-3 bg-[#c8601a] text-white py-4 rounded-full font-bold text-base shadow-lg shadow-[#c8601a]/25 hover:bg-[#b0541a] transition disabled:opacity-70">
//           {loading ? <><Loader size={18} className="animate-spin" /> Starting…</> : <>Start Interview <ChevronRight size={18} /></>}
//         </button>
//       </motion.div>
//     </div>
//   )
// }


import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Loader, FileUp, X } from 'lucide-react'
import api from '../../utils/api'
import { useAuth } from '../../context/AuthContext'

const interviewTypes = [
  { id: 'technical', name: 'Technical', icon: '💻', desc: 'DSA, System Design, Coding' },
  { id: 'hr', name: 'HR Round', icon: '🤝', desc: 'HR, Culture fit' },
  { id: 'behavioral', name: 'Behavioral', icon: '🧠', desc: 'STAR method, examples' },
  { id: 'domain_specific', name: 'Domain', icon: '🎯', desc: 'Role-specific questions' },
]
const difficulties = [
  { id: 'beginner', name: 'Beginner' },
  { id: 'intermediate', name: 'Intermediate' },
  { id: 'advanced', name: 'Advanced' },
]
const jobRoles = [
  'Backend Engineer', 'Frontend Developer', 'Full Stack Engineer',
  'Data Scientist', 'Product Manager', 'Mobile Developer',
  'DevOps Engineer', 'QA Engineer',
]

export default function UserInterviewSetup() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    jobRole: '', interviewType: 'technical', difficulty: 'intermediate', techStack: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const fileInputRef = useRef(null)

  // ── Resume handlers ────────────────────────────────────────────────────────
  const handleResumeSelect = async (file) => {
    if (!file) return
    setResumeFile(file)
    let text = ''
    if (file.type === 'text/plain') {
      text = await file.text()
    } else {
      // PDF/DOC — save metadata as context (real parsing needs backend)
      text = `Resume: ${file.name} — Candidate: ${user?.name || ''}`
    }
    localStorage.setItem('hilearn_resume_text', text)
    localStorage.setItem('hilearn_resume_name', file.name)
  }

  const handleResumeRemove = () => {
    setResumeFile(null)
    localStorage.removeItem('hilearn_resume_text')
    localStorage.removeItem('hilearn_resume_name')
  }

  // ── Start interview ────────────────────────────────────────────────────────
  const handleStart = async () => {
    // if (!formData.jobRole) { setError('Please select a job role.'); return }
    const hasResume = !!localStorage.getItem('hilearn_resume_text')
    if (!formData.jobRole && !hasResume) {
      setError('Please select a job role or upload a resume.');
      return
    }
    if (!user) { setError('You must be logged in to start an interview.'); return }
    setError('')
    setLoading(true)
    try {
      const techStackArray = formData.techStack
        ? formData.techStack.split(',').map(s => s.trim()).filter(Boolean)
        : undefined

      const payload = {
        user_id: user.user_id,
        job_role: formData.jobRole,
        interview_type: formData.interviewType,
        difficulty: formData.difficulty,
        tech_stack: techStackArray,
        resume_text: localStorage.getItem('hilearn_resume_text') || undefined,
      }

      const { data } = await api.post('/interview/start-interview', payload)
      localStorage.setItem('hilearn_interview_session', JSON.stringify(data))
      localStorage.setItem('hilearn_current_question', JSON.stringify(data.first_question))
      navigate('/user/interview')
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to start interview. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs uppercase tracking-[0.2em] text-[#c8601a] font-semibold">Practice</p>
        <h1 className="display-font text-3xl font-bold text-[#0f1f3d] mt-1">Start a New Interview</h1>
        <p className="text-sm text-[#9c9a96] mt-1">Configure your session and let AI do the rest</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="surface-card p-6 space-y-7"
      >

        {/* ── Job Role ── */}
        <div>
          <p className="text-sm font-bold text-[#0f1f3d] mb-3">Target Job Role *</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {jobRoles.map(role => (
              <button
                key={role}
                onClick={() => setFormData({ ...formData, jobRole: role })}
                className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${formData.jobRole === role
                    ? 'border-[#c8601a] bg-[#c8601a]/8 text-[#c8601a]'
                    : 'border-[#e0dbd3] text-[#5c5a57] hover:border-[#c8601a]/50'
                  }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* ── Interview Type ── */}
        <div>
          <p className="text-sm font-bold text-[#0f1f3d] mb-3">Interview Type</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {interviewTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setFormData({ ...formData, interviewType: type.id })}
                className={`p-4 rounded-2xl border-2 text-center transition-all ${formData.interviewType === type.id
                    ? 'border-[#c8601a] bg-[#c8601a]/6'
                    : 'border-[#e0dbd3] hover:border-[#c8601a]/40'
                  }`}
              >
                <div className="text-2xl mb-1">{type.icon}</div>
                <p className="text-xs font-bold text-[#0f1f3d]">{type.name}</p>
                <p className="text-[10px] text-[#9c9a96] mt-0.5">{type.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ── Difficulty ── */}
        <div>
          <p className="text-sm font-bold text-[#0f1f3d] mb-3">Difficulty Level</p>
          <div className="flex gap-3">
            {difficulties.map(d => (
              <button
                key={d.id}
                onClick={() => setFormData({ ...formData, difficulty: d.id })}
                className={`flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${formData.difficulty === d.id
                    ? 'border-[#c8601a] bg-[#c8601a]/8 text-[#c8601a]'
                    : 'border-[#e0dbd3] text-[#5c5a57] hover:border-[#c8601a]/40'
                  }`}
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tech Stack ── */}
        <div>
          <p className="text-sm font-bold text-[#0f1f3d] mb-2">
            Tech Stack <span className="text-[#9c9a96] font-normal">(optional)</span>
          </p>
          <input
            type="text"
            placeholder="e.g. Python, FastAPI, React, PostgreSQL"
            value={formData.techStack}
            onChange={e => setFormData({ ...formData, techStack: e.target.value })}
            className="warm-input text-sm"
          />
          <p className="text-xs text-[#9c9a96] mt-1.5">
            Comma-separated. AI will tailor questions to your stack.
          </p>
        </div>

        {/* ── Resume Upload ── */}
        <div>
          <p className="text-sm font-bold text-[#0f1f3d] mb-2">
            Resume{' '}
            <span className="text-[#9c9a96] font-normal">(optional — for personalized questions)</span>
          </p>

          {resumeFile ? (
            // File selected — show preview
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 border border-[#c8601a]/40 bg-[#c8601a]/5 rounded-xl px-4 py-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0f1f3d] text-white text-[10px] font-bold flex-shrink-0">
                {resumeFile.name.split('.').pop().toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0f1f3d] truncate">{resumeFile.name}</p>
                <p className="text-xs text-emerald-600 mt-0.5">
                  ✅ AI will use this for personalized questions
                </p>
              </div>
              <button
                onClick={handleResumeRemove}
                className="text-rose-400 hover:text-rose-600 transition flex-shrink-0 p-1"
              >
                <X size={16} />
              </button>
            </motion.div>
          ) : (
            // Upload button
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#e0dbd3] rounded-xl py-4 text-sm text-[#9c9a96] hover:border-[#c8601a]/50 hover:text-[#c8601a] transition"
            >
              <FileUp size={16} />
              Click to upload PDF, DOC, or TXT
            </button>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
            onChange={e => handleResumeSelect(e.target.files?.[0])}
          />
        </div>

        {/* ── Info box ── */}
        <div className="rounded-2xl bg-[#0f1f3d]/4 border border-[#0f1f3d]/10 px-5 py-4 text-sm text-[#5c5a57]">
          ⏱️ <strong className="text-[#0f1f3d]">Duration:</strong> 15–25 minutes. You can pause between questions.
        </div>

        {/* ── Error ── */}
        {error && (
          <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        {/* ── Start button ── */}
        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-[#c8601a] text-white py-4 rounded-full font-bold text-base shadow-lg shadow-[#c8601a]/25 hover:bg-[#b0541a] transition disabled:opacity-70"
        >
          {loading
            ? <><Loader size={18} className="animate-spin" /> Starting…</>
            : <>Start Interview <ChevronRight size={18} /></>
          }
        </button>

      </motion.div>
    </div>
  )
}