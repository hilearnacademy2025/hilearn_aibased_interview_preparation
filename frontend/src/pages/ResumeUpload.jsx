

// import { motion } from 'framer-motion'
// import { useEffect, useMemo, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useToast } from '../components/common/ToastProvider'
// import { useAuth } from '../context/AuthContext'


// function ResumeUpload() {
//   const { pushToast } = useToast()
//   const { user } = useAuth()
//   const navigate = useNavigate()
//   const [file, setFile] = useState(null)
//   const [dragActive, setDragActive] = useState(false)
//   const [isProcessing, setIsProcessing] = useState(false)
//   const [resumeText, setResumeText] = useState('')

//   useEffect(() => {
//     document.title = 'Upload Resume | HiLearn Interview Prep'
//   }, [])

//   const preview = useMemo(() => {
//     if (!file) return null
//     return {
//       name: file.name,
//       size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
//       type: file.type || 'Unknown type',
//     }
//   }, [file])

//   // ── File select hone pe text extract karo ──────────────
//   const onFileSelect = async (selectedFile) => {
//     if (!selectedFile) return
//     setFile(selectedFile)
//     setIsProcessing(true)

//     try {
//       // PDF ya text file se text extract karo
//       let text = ''

//       if (selectedFile.type === 'text/plain') {
//         // Plain text file
//         text = await selectedFile.text()
//       } else {
//         // PDF/DOC ke liye — file name + size as context (real PDF parsing needs backend)
//         // Abhi ke liye basic metadata save karo
//         text = `Resume file: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(0)} KB). Candidate: ${user?.name || 'Unknown'}.`
//       }

//       setResumeText(text)
//       localStorage.setItem('hilearn_resume_text', text)
//       localStorage.setItem('hilearn_resume_name', selectedFile.name)

//       pushToast({
//         title: 'Resume ready!',
//         description: 'Your resume context has been saved for the interview.',
//       })
//     } catch (err) {
//       pushToast({
//         title: 'Error',
//         description: 'Could not process file. Try a .txt file.',
//         type: 'error',
//       })
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   const handleRemoveFile = () => {
//     setFile(null)
//     setResumeText('')
//     localStorage.removeItem('hilearn_resume_text')
//     localStorage.removeItem('hilearn_resume_name')
//   }

//   const handleContinue = () => {
//     navigate('/user/interview-setup')
//   }

//   return (
//     <div className="space-y-6">
//       <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
//         <p className="text-xs uppercase tracking-[0.2em] text-[#c8601a] font-semibold">Preparation</p>
//         <h1 className="display-font text-3xl font-bold text-[#0f1f3d] mt-1">Upload Resume</h1>
//         <p className="text-sm text-[#9c9a96] mt-1">Upload your resume so AI can ask personalized questions</p>
//       </motion.div>

//       <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
//         {/* ── Drop Zone ── */}
//         <motion.label
//           initial={{ opacity: 0, x: -16 }}
//           animate={{ opacity: 1, x: 0 }}
//           onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
//           onDragLeave={() => setDragActive(false)}
//           onDrop={(e) => { e.preventDefault(); setDragActive(false); onFileSelect(e.dataTransfer.files?.[0]) }}
//           className={`surface-card relative flex min-h-[320px] cursor-pointer flex-col items-center justify-center px-8 py-10 text-center transition ${dragActive ? 'border-[#c8601a] shadow-[0_22px_60px_rgba(200,96,26,0.16)]' : ''}`}
//         >
//           <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden"
//             onChange={(e) => onFileSelect(e.target.files?.[0])} />

//           <motion.div
//             animate={{ y: [0, -8, 0] }}
//             transition={{ duration: 2.8, repeat: Infinity }}
//             className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#0f1f3d] text-3xl text-white"
//           >
//             ⬆
//           </motion.div>
//           <h2 className="display-font mt-6 text-3xl font-bold text-[#0f1f3d]">
//             {dragActive ? 'Drop your resume here' : 'Drag and drop your resume'}
//           </h2>
//           <p className="mt-3 max-w-md text-sm leading-7 text-[#5c5a57]">
//             PDF, DOC, DOCX, or TXT — max 10MB
//           </p>
//           <div className="mt-5 rounded-full border border-[#e0dbd3] bg-[#fffaf4] px-6 py-2.5 text-sm font-semibold text-[#c8601a]">
//             Choose file
//           </div>
//         </motion.label>

//         {/* ── Preview + Actions ── */}
//         <div className="space-y-5">
//           <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="surface-card px-6 py-6">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="font-bold text-[#0f1f3d]">Preview</h2>
//               {preview && (
//                 <button onClick={handleRemoveFile} className="text-sm text-rose-500 hover:underline">
//                   Remove
//                 </button>
//               )}
//             </div>

//             {isProcessing ? (
//               <div className="rounded-2xl border border-[#e0dbd3] bg-[#fffaf4] px-5 py-5">
//                 <div className="flex items-center gap-3">
//                   <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#c8601a]/40 border-t-[#c8601a]" />
//                   <span className="text-sm text-[#5c5a57]">Processing resume...</span>
//                 </div>
//                 <div className="mt-3 h-2 rounded-full bg-[#f0ebe3]">
//                   <motion.div initial={{ width: 0 }} animate={{ width: '100%' }}
//                     transition={{ duration: 0.9 }}
//                     className="h-2 rounded-full bg-[#c8601a]" />
//                 </div>
//               </div>
//             ) : preview ? (
//               <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
//                 className="rounded-2xl border border-[#e0dbd3] bg-[#fffaf4] px-5 py-5">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0f1f3d] text-white text-xs font-bold">
//                     {preview.name.split('.').pop().toUpperCase()}
//                   </div>
//                   <div className="flex-1">
//                     <p className="font-semibold text-[#0f1f3d] text-sm">{preview.name}</p>
//                     <p className="mt-0.5 text-xs text-[#9c9a96]">Size: {preview.size}</p>
//                   </div>
//                   <span className="text-xl text-emerald-500">✓</span>
//                 </div>
//                 {resumeText && (
//                   <p className="mt-3 text-xs text-[#9c9a96] border-t border-[#f4f2ee] pt-3">
//                     ✅ Resume context saved — AI will use this for personalized questions
//                   </p>
//                 )}
//               </motion.div>
//             ) : (
//               <div className="rounded-2xl border border-dashed border-[#e0dbd3] bg-[#fffaf4] px-5 py-6 text-sm text-[#9c9a96] text-center">
//                 No file selected yet.
//               </div>
//             )}
//           </motion.div>

//           {/* Why it matters */}
//           <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="surface-card px-6 py-6">
//             <h2 className="font-bold text-[#0f1f3d] mb-4">Why upload?</h2>
//             <div className="space-y-2">
//               {[
//                 '🎯 AI asks questions based on your actual experience',
//                 '📋 Relevant tech stack questions from your resume',
//                 '💡 Personalized feedback based on your profile',
//               ].map((item) => (
//                 <div key={item} className="rounded-xl border border-[#e0dbd3] bg-[#fffaf4] px-4 py-3 text-sm text-[#5c5a57]">
//                   {item}
//                 </div>
//               ))}
//             </div>
//           </motion.div>

//           {/* Continue button */}
//           <div className="flex gap-3">
//             <button
//               onClick={handleContinue}
//               className="flex-1 flex items-center justify-center gap-2 bg-[#c8601a] text-white font-semibold px-6 py-3 rounded-full shadow-lg shadow-[#c8601a]/25 hover:bg-[#b0541a] transition text-sm"
//             >
//               {preview ? 'Continue with Resume →' : 'Skip & Continue →'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ResumeUpload






import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/common/ToastProvider'
import { useAuth } from '../context/AuthContext'
import { uploadResume } from '../utils/api'


function ResumeUpload() {
  const { pushToast } = useToast()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [resumeText, setResumeText] = useState('')

  useEffect(() => {
    document.title = 'Upload Resume | HiLearn Interview Prep'
  }, [])

  const preview = useMemo(() => {
    if (!file) return null
    return {
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      type: file.type || 'Unknown type',
    }
  }, [file])

  // ── File select hone pe text extract karo ──────────────
  const onFileSelect = async (selectedFile) => {
    if (!selectedFile) return
    setFile(selectedFile)
    setIsProcessing(true)

    try {
      // PDF ya text file se text extract karo
      let text = ''

      if (selectedFile.type === 'text/plain') {
        // Plain text file
        text = await selectedFile.text()
      } else {
        // PDF/DOC ke liye — file name + size as context (real PDF parsing needs backend)
        // Abhi ke liye basic metadata save karo
        text = `Resume file: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(0)} KB). Candidate: ${user?.name || 'Unknown'}.`
      }

      setResumeText(text)
      localStorage.setItem('hilearn_resume_text', text)
      localStorage.setItem('hilearn_resume_name', selectedFile.name)

      try {
        const result = await uploadResume(selectedFile)
        if (result?.resume_text) {
          localStorage.setItem('hilearn_resume_text', result.resume_text)
        }
      } catch (uploadErr) {
        console.warn('Backend upload failed, using local text:', uploadErr)
      }

      pushToast({
        title: 'Resume ready!',
        description: 'Your resume context has been saved for the interview.',
      })
    } catch (err) {
      pushToast({
        title: 'Error',
        description: 'Could not process file. Try a .txt file.',
        type: 'error',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setResumeText('')
    localStorage.removeItem('hilearn_resume_text')
    localStorage.removeItem('hilearn_resume_name')
  }

  const handleContinue = () => {
    navigate('/user/interview-setup')
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs uppercase tracking-[0.2em] text-[#c8601a] font-semibold">Preparation</p>
        <h1 className="display-font text-3xl font-bold text-[#0f1f3d] mt-1">Upload Resume</h1>
        <p className="text-sm text-[#9c9a96] mt-1">Upload your resume so AI can ask personalized questions</p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* ── Drop Zone ── */}
        <motion.label
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => { e.preventDefault(); setDragActive(false); onFileSelect(e.dataTransfer.files?.[0]) }}
          className={`surface-card relative flex min-h-[320px] cursor-pointer flex-col items-center justify-center px-8 py-10 text-center transition ${dragActive ? 'border-[#c8601a] shadow-[0_22px_60px_rgba(200,96,26,0.16)]' : ''}`}
        >
          <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden"
            onChange={(e) => onFileSelect(e.target.files?.[0])} />

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.8, repeat: Infinity }}
            className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#0f1f3d] text-3xl text-white"
          >
            ⬆
          </motion.div>
          <h2 className="display-font mt-6 text-3xl font-bold text-[#0f1f3d]">
            {dragActive ? 'Drop your resume here' : 'Drag and drop your resume'}
          </h2>
          <p className="mt-3 max-w-md text-sm leading-7 text-[#5c5a57]">
            PDF, DOC, DOCX, or TXT — max 10MB
          </p>
          <div className="mt-5 rounded-full border border-[#e0dbd3] bg-[#fffaf4] px-6 py-2.5 text-sm font-semibold text-[#c8601a]">
            Choose file
          </div>
        </motion.label>

        {/* ── Preview + Actions ── */}
        <div className="space-y-5">
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="surface-card px-6 py-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#0f1f3d]">Preview</h2>
              {preview && (
                <button onClick={handleRemoveFile} className="text-sm text-rose-500 hover:underline">
                  Remove
                </button>
              )}
            </div>

            {isProcessing ? (
              <div className="rounded-2xl border border-[#e0dbd3] bg-[#fffaf4] px-5 py-5">
                <div className="flex items-center gap-3">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#c8601a]/40 border-t-[#c8601a]" />
                  <span className="text-sm text-[#5c5a57]">Processing resume...</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-[#f0ebe3]">
                  <motion.div initial={{ width: 0 }} animate={{ width: '100%' }}
                    transition={{ duration: 0.9 }}
                    className="h-2 rounded-full bg-[#c8601a]" />
                </div>
              </div>
            ) : preview ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-[#e0dbd3] bg-[#fffaf4] px-5 py-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0f1f3d] text-white text-xs font-bold">
                    {preview.name.split('.').pop().toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[#0f1f3d] text-sm">{preview.name}</p>
                    <p className="mt-0.5 text-xs text-[#9c9a96]">Size: {preview.size}</p>
                  </div>
                  <span className="text-xl text-emerald-500">✓</span>
                </div>
                {resumeText && (
                  <p className="mt-3 text-xs text-[#9c9a96] border-t border-[#f4f2ee] pt-3">
                    ✅ Resume context saved — AI will use this for personalized questions
                  </p>
                )}
              </motion.div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#e0dbd3] bg-[#fffaf4] px-5 py-6 text-sm text-[#9c9a96] text-center">
                No file selected yet.
              </div>
            )}
          </motion.div>

          {/* Why it matters */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="surface-card px-6 py-6">
            <h2 className="font-bold text-[#0f1f3d] mb-4">Why upload?</h2>
            <div className="space-y-2">
              {[
                '🎯 AI asks questions based on your actual experience',
                '📋 Relevant tech stack questions from your resume',
                '💡 Personalized feedback based on your profile',
              ].map((item) => (
                <div key={item} className="rounded-xl border border-[#e0dbd3] bg-[#fffaf4] px-4 py-3 text-sm text-[#5c5a57]">
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Continue button */}
          <div className="flex gap-3">
            <button
              onClick={handleContinue}
              className="flex-1 flex items-center justify-center gap-2 bg-[#c8601a] text-white font-semibold px-6 py-3 rounded-full shadow-lg shadow-[#c8601a]/25 hover:bg-[#b0541a] transition text-sm"
            >
              {preview ? 'Continue with Resume →' : 'Skip & Continue →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeUpload