import { motion } from 'framer-motion'
import { useEffect } from 'react'
import PageTransition from '../components/common/PageTransition'
import SectionDivider from '../components/common/SectionDivider'
import { fadeUp, staggerContainer } from '../components/common/motion'

const features = [
  {
    title: 'Dynamic AI interviews',
    description: 'Role-based rounds that adapt to your answers and keep pressure realistic without breaking flow.',
    bullets: ['Live follow-up questions', 'Role-aware prompts', 'Difficulty scaling', 'Context from your profile'],
  },
  {
    title: 'Communication feedback',
    description: 'Clarity, pacing, confidence, and signal quality all surface in a format you can act on immediately.',
    bullets: ['Confidence trends', 'Clarity bars', 'Filler word detection', 'Speaking pace insights'],
  },
  {
    title: 'Visual dashboard analytics',
    description: 'Practice history turns into a premium control room with motion-driven charts and readable snapshots.',
    bullets: ['History cards', 'Animated bar charts', 'Health visibility', 'Progress summaries'],
  },
  {
    title: 'India-first practice context',
    description: 'Use company and role context that feels relevant to your interviews instead of generic global templates.',
    bullets: ['Placement-season ready', 'Startup and enterprise roles', 'Technical and HR tracks', 'Resume-aware sessions'],
  },
]

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <motion.path
        d="M5 12.5L9.2 16.5L19 7.5"
        fill="none"
        stroke="#c8601a"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
    </svg>
  )
}

function Features() {
  useEffect(() => {
    document.title = 'Features | HiLearn - AI Mock Interview Platform'
  }, [])

  return (
    <PageTransition>
      <section className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm uppercase tracking-[0.24em] text-[#c8601a]">Feature suite</p>
          <h1 className="display-font mt-4 text-5xl font-bold leading-tight text-[#0f1f3d] md:text-6xl">
            Powerful features, arranged with premium warmth instead of product clutter.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#5c5a57]">
            Every section alternates between narrative context and a visual feature card so the page feels editorial, calm, and clear.
          </p>
        </motion.div>
      </section>

      <section className="section-shell mt-16 space-y-10">
        {features.map((feature, index) => {
          const reverse = index % 2 === 1
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              className={`grid gap-8 lg:grid-cols-2 lg:items-center ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}
            >
              <div className="space-y-5">
                <span className="warm-pill">Feature {index + 1}</span>
                <h2 className="display-font text-4xl font-bold text-[#0f1f3d]">{feature.title}</h2>
                <p className="text-lg leading-8 text-[#5c5a57]">{feature.description}</p>
                <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-3">
                  {feature.bullets.map((bullet) => (
                    <motion.div key={bullet} variants={fadeUp} className="flex items-center gap-3 rounded-2xl border border-[#e0dbd3] bg-white px-4 py-3">
                      <CheckIcon />
                      <span className="text-sm text-[#5c5a57]">{bullet}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
              <motion.div whileHover={{ y: -5, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }} className="surface-card relative overflow-hidden p-8">
                <div className="absolute right-8 top-8 spin-slow rounded-full border border-[#c8601a]/20 p-8">
                  <div className="rounded-full border border-[#0f1f3d]/10 p-8">
                    <div className="h-10 w-10 rounded-full bg-[#c8601a]/15" />
                  </div>
                </div>
                <div className="relative mt-24 rounded-[28px] border border-[#e0dbd3] bg-[#fffaf4] p-6">
                  <p className="text-sm uppercase tracking-[0.22em] text-[#9c9a96]">Feature canvas</p>
                  <p className="mt-3 text-2xl font-semibold text-[#0f1f3d]">{feature.title}</p>
                  <p className="mt-3 text-[#5c5a57]">{feature.description}</p>
                </div>
              </motion.div>
            </motion.div>
          )
        })}
      </section>

      <div className="mt-20">
        <SectionDivider flip />
      </div>
    </PageTransition>
  )
}

export default Features
