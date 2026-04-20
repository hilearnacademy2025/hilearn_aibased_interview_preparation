import { motion } from 'framer-motion'
import { useEffect } from 'react'
import AnimatedCounter from '../components/common/AnimatedCounter'
import PageTransition from '../components/common/PageTransition'
import { fadeUp, scaleIn, staggerContainer } from '../components/common/motion'

const values = [
  { title: 'Honest', description: 'Feedback should tell you what improved and what still needs work.' },
  { title: 'Student-first', description: 'Built for clarity, not overwhelm, especially during placement season.' },
  { title: 'Fast', description: 'Sessions, scoring, and review surfaces are designed for repeatable momentum.' },
  { title: 'India-aware', description: 'We respect the realities of Indian campus hiring and early-career roles.' },
]

const differences = [
  'Warm editorial UI that lowers practice anxiety',
  'Interview flows that preserve your current product logic',
  'Dashboard and feedback views built for readable signal',
  'A premium light theme that feels distinct from blue SaaS templates',
]

function About() {
  useEffect(() => {
    document.title = 'About HiLearn | AI-Powered Interview Prep for India'
  }, [])

  return (
    <PageTransition>
      <section className="section-shell">
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-[#c8601a]">About HiLearn</p>
          <h1 className="display-font mt-4 text-5xl font-bold text-[#0f1f3d] md:text-6xl">
            Interview preparation should feel focused, premium, and deeply human.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#5c5a57]">
            HiLearn was shaped for ambitious students who want a serious practice environment without a cold, generic interface.
          </p>
        </motion.div>
      </section>

      <section className="section-shell mt-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"
        >
          {[
            { label: 'Learners supported', value: 10000, suffix: '+' },
            { label: 'Average confidence score', value: 8.7, suffix: '/10', decimals: 1 },
            { label: 'Roles covered', value: 40, suffix: '+' },
            { label: 'Campus-ready workflows', value: 12, suffix: '' },
          ].map((item) => (
            <motion.div key={item.label} variants={fadeUp} className="surface-card px-6 py-7">
              <p className="text-sm uppercase tracking-[0.18em] text-[#9c9a96]">{item.label}</p>
              <AnimatedCounter
                value={item.value}
                suffix={item.suffix}
                decimals={item.decimals}
                className="mt-4 block display-font text-4xl font-bold text-[#0f1f3d]"
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="section-shell mt-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }}>
            <p className="text-sm uppercase tracking-[0.24em] text-[#c8601a]">Our mission</p>
            <h2 className="display-font mt-3 text-4xl font-bold text-[#0f1f3d] md:text-5xl">
              Make strong interview prep accessible without sacrificing polish.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#5c5a57]">
              In many places, meaningful interview coaching is still expensive or inconsistent. HiLearn gives students a structured AI practice room, performance analysis, and design quality that makes returning feel natural.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="navy-panel relative rounded-[32px] p-8"
          >
            <p className="text-sm uppercase tracking-[0.24em] text-white/60">Mission note</p>
            <p className="mt-4 display-font text-3xl font-bold text-white">
              “Make interview prep affordable, calming, and genuinely useful for every ambitious student.”
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-shell mt-20">
        <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-[#c8601a]">Our values</p>
          <h2 className="display-font mt-3 text-4xl font-bold text-[#0f1f3d] md:text-5xl">The principles behind the product.</h2>
        </motion.div>
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {values.map((value) => (
            <motion.div
              key={value.title}
              variants={scaleIn}
              whileHover={{ y: -5, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
              className="surface-card px-6 py-7 text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#c8601a]/10 text-[#c8601a]">•</div>
              <h3 className="mt-5 text-2xl font-semibold text-[#0f1f3d]">{value.title}</h3>
              <p className="mt-3 text-[#5c5a57]">{value.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="section-shell mt-20">
        <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-[#c8601a]">Why HiLearn is different</p>
          <h2 className="display-font mt-3 text-4xl font-bold text-[#0f1f3d] md:text-5xl">A calmer visual language with sharper practice outcomes.</h2>
        </motion.div>
        <div className="grid gap-5 md:grid-cols-2">
          {differences.map((item) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ rotateX: 4, y: -5, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
              style={{ perspective: 1200 }}
              className="surface-card px-6 py-7"
            >
              <p className="text-lg leading-8 text-[#5c5a57]">{item}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </PageTransition>
  )
}

export default About
