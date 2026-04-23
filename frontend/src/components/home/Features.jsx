
import { motion as Motion } from 'framer-motion'
import { useState } from 'react'

const features = [
  {
    title: 'AI interview engine',
    copy: 'Switch between technical, behavioral, HR, and domain-specific rounds with a clear learning-first flow.',
    icon: '🤖',
  },
  {
    title: 'Voice-first interaction',
    copy: 'A polished microphone surface, transcript area, and timing cues make practice feel more natural.',
    icon: '🎤',
  },
  {
    title: 'Resume-informed prep',
    copy: 'Upload your resume to shape a personalized prep journey without adding fake backend behavior.',
    icon: '📄',
  },
  {
    title: 'Actionable feedback',
    copy: 'Scorecards, bars, and next-step hints turn every attempt into something students can improve immediately.',
    icon: '📊',
  },
]

function Features() {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  return (
    <section id="features" className="bg-gray-100 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
              Why students stay
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 max-w-2xl leading-tight">
              Everything feels structured, coach-like, and placement-ready.
            </h2>
          </div>
          <p className="text-gray-600 max-w-md text-lg leading-relaxed">
            The product language, surfaces, and interactions are designed to feel like a modern learning platform,
            not a cluttered dashboard of random widgets.
          </p>
        </Motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.03 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative rounded-2xl border border-blue-200 bg-white p-6 shadow-lg shadow-blue-200/50 transition-all duration-300 cursor-pointer group overflow-hidden"
            >
              <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white -z-10"
              />
              
              <Motion.div
                animate={{
                  scale: hoveredIndex === index ? 1.1 : 1,
                  rotate: hoveredIndex === index ? [0, -5, 5, 0] : 0,
                }}
                transition={{ duration: 0.4 }}
                className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 text-2xl text-white shadow-md shadow-blue-500/40"
              >
                {feature.icon}
              </Motion.div>
              
              <div className="absolute top-4 right-4 text-4xl font-bold text-blue-100/60">
                0{index + 1}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mt-2 relative z-10">
                {feature.title}
              </h3>
              
              <p className="mt-3 text-sm leading-7 text-gray-600 relative z-10">
                {feature.copy}
              </p>
              
              <Motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: hoveredIndex === index ? 1 : 0, x: hoveredIndex === index ? 0 : -10 }}
                transition={{ duration: 0.3 }}
                className="mt-4 flex items-center gap-1 text-blue-600 text-sm font-medium"
              >
                <span>Learn more</span>
                <span>→</span>
              </Motion.div>
            </Motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features