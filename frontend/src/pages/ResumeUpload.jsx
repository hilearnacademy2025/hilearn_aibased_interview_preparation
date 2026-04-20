import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import Button from '../components/common/Button'
import PageTransition from '../components/common/PageTransition'
import { useToast } from '../components/common/ToastProvider'

function ResumeUpload() {
  const { pushToast } = useToast()
  const [file, setFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

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

  const onFileSelect = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile)
      setIsUploading(true)
      pushToast({
        title: 'Resume selected',
        description: 'Your file preview is ready.',
      })
      window.setTimeout(() => setIsUploading(false), 1000)
    }
  }

  const handleRemoveFile = () => setFile(null)

  return (
    <PageTransition>
      <section className="section-shell">
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} className="navy-panel relative overflow-hidden rounded-[34px] p-8 md:p-10">
          <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 6, repeat: Infinity }} className="ambient-blob right-0 top-0 h-48 w-48 bg-[#c8601a]/28" />
          <div className="relative">
            <p className="text-sm uppercase tracking-[0.24em] text-white/55">Resume upload</p>
            <h1 className="display-font mt-3 text-5xl font-bold text-white md:text-6xl">Prepare your profile context before the interview.</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/70">The drag zone, file preview, progress bar, and next action all adopt the new premium warm theme.</p>
          </div>
        </motion.div>
      </section>

      <section className="section-shell mt-10 grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
        <motion.label
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          onDragOver={(event) => { event.preventDefault(); setDragActive(true) }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(event) => { event.preventDefault(); setDragActive(false); onFileSelect(event.dataTransfer.files?.[0]) }}
          className={`surface-card relative flex min-h-[420px] cursor-pointer flex-col items-center justify-center px-8 py-10 text-center transition ${dragActive ? 'border-[#c8601a] shadow-[0_22px_60px_rgba(200,96,26,0.16)]' : ''}`}
        >
          <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(event) => onFileSelect(event.target.files?.[0])} />
          <motion.div animate={{ y: dragActive ? [0, -8, 0] : [0, -8, 0] }} transition={{ duration: 2.8, repeat: Infinity }} className="animate-float flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#0f1f3d] text-3xl text-white">
            ⬆
          </motion.div>
          <h2 className="display-font mt-6 text-4xl font-bold text-[#0f1f3d]">{dragActive ? 'Drop your resume here' : 'Drag and drop your resume'}</h2>
          <p className="mt-4 max-w-md text-base leading-7 text-[#5c5a57]">Upload PDF or Word files to personalize interview sessions with profile-aware context.</p>
          <div className="mt-6 rounded-full border border-[#e0dbd3] bg-[#fffaf4] px-6 py-3 text-sm font-semibold text-[#c8601a]">
            Choose file
          </div>
        </motion.label>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="surface-card px-6 py-7">
            <div className="flex items-center justify-between">
              <h2 className="display-font text-3xl font-bold text-[#0f1f3d]">Preview</h2>
              {preview && <button onClick={handleRemoveFile} className="text-sm text-[#c8601a]">Remove</button>}
            </div>
            {isUploading ? (
              <div className="mt-6 rounded-[24px] border border-[#e0dbd3] bg-[#fffaf4] px-5 py-5">
                <div className="flex items-center gap-3">
                  <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#c8601a]/40 border-t-[#c8601a]" />
                  <span className="text-sm text-[#5c5a57]">Uploading resume...</span>
                </div>
                <div className="mt-4 h-3 rounded-full bg-[#f0ebe3]">
                  <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 0.9 }} className="h-3 rounded-full bg-[#c8601a]" />
                </div>
              </div>
            ) : preview ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 rounded-[24px] border border-[#e0dbd3] bg-[#fffaf4] px-5 py-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#0f1f3d] text-white">PDF</div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-[#0f1f3d]">{preview.name}</p>
                    <p className="mt-1 text-sm text-[#5c5a57]">{preview.type}</p>
                    <p className="mt-1 text-sm text-[#9c9a96]">Size: {preview.size}</p>
                  </div>
                  <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }} className="text-2xl text-emerald-500">
                    ✓
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <div className="mt-6 rounded-[24px] border border-dashed border-[#e0dbd3] bg-[#fffaf4] px-5 py-6 text-sm text-[#9c9a96]">
                No file selected yet.
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="surface-card px-6 py-7">
            <h2 className="display-font text-3xl font-bold text-[#0f1f3d]">Why it matters</h2>
            <div className="mt-5 space-y-3">
              {[
                'Makes interview setup feel personalized before parsing is introduced.',
                'Keeps profile context ready for future backend extraction.',
                'Builds candidate confidence before a live round begins.',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-[#e0dbd3] bg-[#fffaf4] px-4 py-4 text-sm text-[#5c5a57]">
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          {preview && <Button to="/interview" className="w-full justify-center py-4 text-base">Continue to interview</Button>}
        </div>
      </section>
    </PageTransition>
  )
}

export default ResumeUpload
