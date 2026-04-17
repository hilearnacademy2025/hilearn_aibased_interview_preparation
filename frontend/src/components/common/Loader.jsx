import { motion as Motion } from 'framer-motion'

function Loader({ label = 'Loading experience...' }) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 rounded-[2rem] border border-white/50 bg-white/60 p-8 text-center shadow-lg shadow-slate-200/50 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((item) => (
          <Motion.span
            key={item}
            className="h-3 w-3 rounded-full bg-sky-500"
            animate={{ y: [0, -8, 0], opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: item * 0.12 }}
          />
        ))}
      </div>
      <p className="text-sm font-medium text-slate-600">{label}</p>
    </div>
  )
}

export default Loader
