import { motion } from 'framer-motion'

function Loader({ label = 'Loading experience...' }) {
  return (
    <div className="section-shell py-16">
      <div className="surface-card mx-auto flex min-h-[280px] max-w-xl flex-col items-center justify-center gap-6 px-8 text-center">
        <div className="relative h-20 w-20">
          <svg viewBox="0 0 80 80" className="h-20 w-20">
            <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(15,31,61,0.12)" strokeWidth="8" />
            <motion.circle
              cx="40"
              cy="40"
              r="30"
              fill="none"
              stroke="#c8601a"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="110 188"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              style={{ originX: '50%', originY: '50%' }}
            />
          </svg>
          <div className="absolute inset-4 rounded-full bg-[#0f1f3d]" />
        </div>
        <div className="space-y-2">
          <p className="display-font text-2xl font-bold text-[#0f1f3d]">HiLearn is preparing your workspace</p>
          <p className="text-sm text-[#5c5a57]">{label}</p>
        </div>
      </div>
    </div>
  )
}

export default Loader
