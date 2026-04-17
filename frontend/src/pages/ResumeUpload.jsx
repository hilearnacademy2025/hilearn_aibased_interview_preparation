
// import { useMemo, useState } from 'react'
// import { motion as Motion } from 'framer-motion'

// function ResumeUpload() {
//   const [file, setFile] = useState(null)
//   const [dragActive, setDragActive] = useState(false)
//   const [isUploading, setIsUploading] = useState(false)

//   const preview = useMemo(() => {
//     if (!file) {
//       return null
//     }

//     return {
//       name: file.name,
//       size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
//       type: file.type || 'Unknown type',
//     }
//   }, [file])

//   const onFileSelect = (selectedFile) => {
//     if (selectedFile) {
//       setFile(selectedFile)
//       // Simulate upload processing
//       setIsUploading(true)
//       setTimeout(() => {
//         setIsUploading(false)
//       }, 1000)
//     }
//   }

//   const handleRemoveFile = () => {
//     setFile(null)
//   }

//   return (
//     <Motion.div
//       initial={{ opacity: 0, y: 14 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="min-h-screen bg-gray-50 py-20 px-4"
//     >
//       <div className="max-w-6xl mx-auto">
        
//         {/* Hero Banner */}
//         <Motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 p-8 text-white shadow-xl shadow-blue-500/30"
//         >
//           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
//           <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32" />
          
//           <div className="relative z-10">
//             <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-100">
//               📄 Resume upload
//             </p>
//             <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
//               Prepare your profile context before the interview.
//             </h1>
//             <p className="mt-4 max-w-2xl text-base leading-7 text-blue-100">
//               This page keeps the experience production-ready with drag and drop, local preview, and a clean state model,
//               while respecting your requirement not to invent backend upload APIs.
//             </p>
//           </div>
//         </Motion.div>

//         <div className="mt-10 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          
//           {/* Drag & Drop Area */}
//           <Motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5, delay: 0.1 }}
//           >
//             <label
//               onDragOver={(event) => {
//                 event.preventDefault()
//                 setDragActive(true)
//               }}
//               onDragLeave={() => setDragActive(false)}
//               onDrop={(event) => {
//                 event.preventDefault()
//                 setDragActive(false)
//                 onFileSelect(event.dataTransfer.files?.[0])
//               }}
//               className={`relative flex min-h-[400px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
//                 dragActive 
//                   ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20' 
//                   : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50/30'
//               }`}
//             >
//               <input
//                 type="file"
//                 accept=".pdf,.doc,.docx"
//                 className="hidden"
//                 onChange={(event) => onFileSelect(event.target.files?.[0])}
//               />
              
//               {/* Animated Icon */}
//               <Motion.div
//                 animate={{
//                   y: dragActive ? [0, -10, 0] : 0,
//                   scale: dragActive ? 1.1 : 1,
//                 }}
//                 transition={{ duration: 0.5, repeat: dragActive ? Infinity : 0 }}
//                 className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 text-3xl text-white shadow-lg shadow-blue-500/30"
//               >
//                 📄
//               </Motion.div>
              
//               <h2 className="mt-6 text-2xl font-bold text-gray-900">
//                 {dragActive ? 'Drop your resume here' : 'Drag and drop your resume'}
//               </h2>
//               <p className="mt-3 max-w-md text-sm leading-7 text-gray-500">
//                 Upload PDF or Word files to preview the candidate profile and make the interview setup feel personalized.
//               </p>
              
//               <Motion.div
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="mt-6 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 cursor-pointer"
//               >
//                 📁 Choose file
//               </Motion.div>
              
//               <p className="mt-4 text-xs text-gray-400">
//                 Supported formats: PDF, DOC, DOCX (Max 5MB)
//               </p>
//             </label>
//           </Motion.div>

//           {/* Right Side - Preview & Info */}
//           <div className="space-y-6">
            
//             {/* Preview Card */}
//             <Motion.div
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//               className="rounded-2xl border border-blue-100 bg-white p-7 shadow-lg shadow-blue-100/40"
//             >
//               <div className="flex items-center justify-between">
//                 <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                   <span>📋</span> Preview
//                 </h2>
//                 {preview && (
//                   <Motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={handleRemoveFile}
//                     className="text-red-500 hover:text-red-600 text-sm cursor-pointer"
//                   >
//                     Remove
//                   </Motion.button>
//                 )}
//               </div>
              
//               {isUploading ? (
//                 <div className="mt-5 rounded-xl bg-blue-50 p-6 text-center">
//                   <div className="flex flex-col items-center gap-3">
//                     <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
//                     <p className="text-sm text-blue-600">Uploading resume...</p>
//                   </div>
//                 </div>
//               ) : preview ? (
//                 <Motion.div
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   className="mt-5 rounded-xl border border-blue-100 bg-blue-50/30 p-5"
//                 >
//                   <div className="flex items-start gap-3">
//                     <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
//                       📄
//                     </div>
//                     <div className="flex-1">
//                       <p className="font-semibold text-gray-900">{preview.name}</p>
//                       <p className="mt-1 text-xs text-gray-500">{preview.type}</p>
//                       <p className="mt-1 text-xs text-gray-500">Size: {preview.size}</p>
//                     </div>
//                     <Motion.div
//                       whileHover={{ scale: 1.1 }}
//                       className="text-green-500 text-xl"
//                     >
//                       ✓
//                     </Motion.div>
//                   </div>
//                 </Motion.div>
//               ) : (
//                 <div className="mt-5 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
//                   <div className="text-4xl mb-2">📭</div>
//                   <p className="text-sm text-gray-500">
//                     No file selected yet. Drop a resume to preview basic metadata here.
//                   </p>
//                 </div>
//               )}
//             </Motion.div>

//             {/* Why It Matters Card */}
//             <Motion.div
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5, delay: 0.3 }}
//               className="rounded-2xl border border-blue-100 bg-white p-7 shadow-lg shadow-blue-100/40"
//             >
//               <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                 <span>💡</span> Why it matters
//               </h2>
//               <div className="mt-5 space-y-3">
//                 {[
//                   'Makes the setup feel personalized before API-side parsing is added.',
//                   'Keeps resume context ready for future backend-supported extraction.',
//                   'Gives students confidence that profile-based interviews are part of the workflow.',
//                 ].map((item, idx) => (
//                   <Motion.div
//                     key={idx}
//                     initial={{ opacity: 0, x: -10 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: 0.4 + idx * 0.1 }}
//                     className="flex gap-3 text-sm leading-7 text-gray-600"
//                   >
//                     <span className="mt-1 text-blue-500">✓</span>
//                     <span>{item}</span>
//                   </Motion.div>
//                 ))}
//               </div>
//             </Motion.div>

//             {/* Next Step Button */}
//             {preview && (
//               <Motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.4 }}
//               >
//                 <Motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   className="w-full cursor-pointer rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold shadow-md shadow-blue-500/30 hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
//                 >
//                   Continue to Interview →
//                 </Motion.button>
//               </Motion.div>
//             )}
//           </div>
//         </div>
//       </div>
//     </Motion.div>
//   )
// }

// export default ResumeUpload

import { useMemo, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { Link } from 'react-router-dom'

function ResumeUpload() {
  const [file, setFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const preview = useMemo(() => {
    if (!file) {
      return null
    }

    return {
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      type: file.type || 'Unknown type',
    }
  }, [file])

  const onFileSelect = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile)
      // Simulate upload processing
      setIsUploading(true)
      setTimeout(() => {
        setIsUploading(false)
      }, 1000)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
  }

  return (
    <Motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-100 py-20 px-4"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Hero Banner - Darker */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 p-8 text-white shadow-xl shadow-blue-500/30"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32" />
          
          <div className="relative z-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-100">
              📄 Resume upload
            </p>
            <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
              Prepare your profile context before the interview.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-blue-100">
              Upload your resume to help our AI understand your background and generate personalized interview questions.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-full bg-white/15 px-3 py-1.5 text-xs backdrop-blur-sm">
                🔒 Secure & Private
              </div>
              <div className="rounded-full bg-white/15 px-3 py-1.5 text-xs backdrop-blur-sm">
                📄 PDF, DOC, DOCX
              </div>
              <div className="rounded-full bg-white/15 px-3 py-1.5 text-xs backdrop-blur-sm">
                ⚡ Instant Preview
              </div>
            </div>
          </div>
        </Motion.div>

        <div className="mt-10 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          
          {/* Drag & Drop Area */}
          <Motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <label
              onDragOver={(event) => {
                event.preventDefault()
                setDragActive(true)
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(event) => {
                event.preventDefault()
                setDragActive(false)
                onFileSelect(event.dataTransfer.files?.[0])
              }}
              className={`relative flex min-h-[400px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20' 
                  : 'border-blue-200 bg-white hover:border-blue-400 hover:bg-blue-50/30'
              }`}
            >
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(event) => onFileSelect(event.target.files?.[0])}
              />
              
              {/* Animated Icon */}
              <Motion.div
                animate={{
                  y: dragActive ? [0, -10, 0] : 0,
                  scale: dragActive ? 1.1 : 1,
                }}
                transition={{ duration: 0.5, repeat: dragActive ? Infinity : 0 }}
                className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 text-3xl text-white shadow-lg shadow-blue-500/30"
              >
                📄
              </Motion.div>
              
              <h2 className="mt-6 text-2xl font-bold text-gray-900">
                {dragActive ? 'Drop your resume here' : 'Drag and drop your resume'}
              </h2>
              <p className="mt-3 max-w-md text-sm leading-7 text-gray-500">
                Upload PDF or Word files to preview the candidate profile and make the interview setup feel personalized.
              </p>
              
              <Motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 cursor-pointer"
              >
                📁 Choose file
              </Motion.div>
              
              <p className="mt-4 text-xs text-gray-400">
                Supported formats: PDF, DOC, DOCX (Max 5MB)
              </p>
            </label>
          </Motion.div>

          {/* Right Side - Preview & Info */}
          <div className="space-y-6">
            
            {/* Preview Card - Darker */}
            <Motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl border border-blue-200 bg-white p-7 shadow-lg shadow-blue-200/50"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span>📋</span> Preview
                </h2>
                {preview && (
                  <Motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRemoveFile}
                    className="text-red-500 hover:text-red-600 text-sm cursor-pointer"
                  >
                    Remove
                  </Motion.button>
                )}
              </div>
              
              {isUploading ? (
                <div className="mt-5 rounded-xl bg-blue-50 p-6 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
                    <p className="text-sm text-blue-600">Uploading resume...</p>
                  </div>
                </div>
              ) : preview ? (
                <Motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-5 rounded-xl border border-blue-200 bg-blue-50/30 p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      📄
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{preview.name}</p>
                      <p className="mt-1 text-xs text-gray-500">{preview.type}</p>
                      <p className="mt-1 text-xs text-gray-500">Size: {preview.size}</p>
                    </div>
                    <Motion.div
                      whileHover={{ scale: 1.1 }}
                      className="text-green-500 text-xl"
                    >
                      ✓
                    </Motion.div>
                  </div>
                </Motion.div>
              ) : (
                <div className="mt-5 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                  <div className="text-4xl mb-2">📭</div>
                  <p className="text-sm text-gray-500">
                    No file selected yet. Drop a resume to preview basic metadata here.
                  </p>
                </div>
              )}
            </Motion.div>

            {/* Why It Matters Card - Darker */}
            <Motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-2xl border border-blue-200 bg-white p-7 shadow-lg shadow-blue-200/50"
            >
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span>💡</span> Why it matters
              </h2>
              <div className="mt-5 space-y-3">
                {[
                  'Makes the setup feel personalized before API-side parsing is added.',
                  'Keeps resume context ready for future backend-supported extraction.',
                  'Gives students confidence that profile-based interviews are part of the workflow.',
                ].map((item, idx) => (
                  <Motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    className="flex gap-3 text-sm leading-7 text-gray-600"
                  >
                    <span className="mt-1 text-blue-500">✓</span>
                    <span>{item}</span>
                  </Motion.div>
                ))}
              </div>
            </Motion.div>

            {/* Quick Tips Card - New */}
            <Motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="rounded-2xl bg-gradient-to-r from-blue-50 to-white p-6 border border-blue-200"
            >
              <p className="text-sm font-semibold text-blue-600">📌 Quick Tips</p>
              <div className="mt-3 space-y-2">
                <p className="text-sm text-gray-600">• Use a clear, updated resume format</p>
                <p className="text-sm text-gray-600">• Highlight relevant skills and projects</p>
                <p className="text-sm text-gray-600">• Include your tech stack and experience level</p>
              </div>
            </Motion.div>

            {/* Next Step Button */}
            {preview && (
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link to="/interview">
                  <Motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full cursor-pointer rounded-xl bg-blue-600 px-6 py-3.5 text-white font-semibold shadow-md shadow-blue-500/30 hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
                  >
                    Continue to Interview →
                  </Motion.button>
                </Link>
              </Motion.div>
            )}
          </div>
        </div>

        {/* Benefits Section - New */}
        {!preview && (
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 grid gap-4 md:grid-cols-3"
          >
            <div className="rounded-xl border border-blue-200 bg-white p-4 text-center shadow-sm">
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-sm font-semibold text-gray-900">Personalized Questions</p>
              <p className="text-xs text-gray-500">AI generates questions based on your resume</p>
            </div>
            <div className="rounded-xl border border-blue-200 bg-white p-4 text-center shadow-sm">
              <div className="text-2xl mb-2">⚡</div>
              <p className="text-sm font-semibold text-gray-900">Faster Setup</p>
              <p className="text-xs text-gray-500">Auto-fill your profile information</p>
            </div>
            <div className="rounded-xl border border-blue-200 bg-white p-4 text-center shadow-sm">
              <div className="text-2xl mb-2">🔒</div>
              <p className="text-sm font-semibold text-gray-900">Privacy First</p>
              <p className="text-xs text-gray-500">Your data stays secure and private</p>
            </div>
          </Motion.div>
        )}
      </div>
    </Motion.div>
  )
}

export default ResumeUpload