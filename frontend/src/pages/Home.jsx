import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Button from '../components/common/Button'
import AnimatedCounter from '../components/common/AnimatedCounter'
import PageTransition from '../components/common/PageTransition'
import SectionDivider from '../components/common/SectionDivider'
import { fadeUp, staggerContainer } from '../components/common/motion'
import LMSCoursesSection from '../components/home/LMSCoursesSection'

const stats = [
  { label: 'Mock interviews completed', value: 4800, suffix: '+' },
  { label: 'Average score lift', value: 8.4, suffix: '/10', decimals: 1 },
  { label: 'Hiring tracks covered', value: 32, suffix: '+' },
  { label: 'Students who return weekly', value: 92, suffix: '%' },
]

const process = [
  {
    step: '01',
    title: 'Set your interview room',
    description: 'Choose role, difficulty, company focus, and resume context so every round feels relevant.',
  },
  {
    step: '02',
    title: 'Answer with focus',
    description: 'Practice in a calm live environment with pacing, timers, and feedback signals that feel premium rather than noisy.',
  },
  {
    step: '03',
    title: 'Review the signal',
    description: 'Turn scores, strengths, communication patterns, and next-step recommendations into your next session plan.',
  },
]

const testimonials = [
  {
    name: 'Aditi, Frontend Intern',
    quote: 'The feedback felt like a coach who knows where I hesitate and how to fix it before my next interview.',
  },
  {
    name: 'Rohan, Data Analyst Candidate',
    quote: 'I finally had a dashboard that made my progress visible instead of guessing whether I was improving.',
  },
  {
    name: 'Mansi, Product Operations',
    quote: 'The warm design and structured prompts made practice feel calm enough to repeat every week.',
  },
]

function Home() {
  const location = useLocation()

  useEffect(() => {
    document.title = 'HiLearn | AI-Powered Mock Interviews for Indian Students'
  }, [])

  useEffect(() => {
    if (!location.state?.scrollTo) return
    const element = document.getElementById(location.state.scrollTo)
    if (element) {
      window.setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 120)
    }
  }, [location.state])

  return (
    <PageTransition>
      <section className="section-shell relative pt-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.span variants={fadeUp} className="warm-pill">
              Premium AI interview practice for ambitious students
            </motion.span>
            <motion.h1 variants={fadeUp} className="display-font max-w-3xl text-5xl font-bold leading-tight text-[#0f1f3d] md:text-7xl">
              Build interview confidence with a <span className="shimmer-text">warmer, sharper</span> practice space.
            </motion.h1>
            <motion.p variants={fadeUp} className="max-w-2xl text-lg leading-8 text-[#5c5a57]">
              HiLearn gives you editorial-grade polish, live interview flow, and immediate coaching signals without touching your existing product logic.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Button to="/interview" className="px-7 py-4 text-base">
                Start practicing
              </Button>
              <Button to="/dashboard" variant="secondary" className="px-7 py-4 text-base">
                View dashboard
              </Button>
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              {['Warm light theme', 'Live AI rounds', 'Feedback you can act on'].map((pill) => (
                <span key={pill} className="rounded-full border border-[#e0dbd3] bg-white px-4 py-2 text-sm text-[#5c5a57] shadow-sm">
                  {pill}
                </span>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="navy-panel relative overflow-hidden rounded-[32px] p-8"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="ambient-blob -left-8 top-0 h-36 w-36 bg-[#c8601a]/30"
              />
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 6.4, repeat: Infinity }}
                className="ambient-blob bottom-0 right-0 h-40 w-40 bg-white/10"
              />
              <div className="relative space-y-8">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-white/60">Live mock score</p>
                    <p className="mt-2 display-font text-5xl font-bold">8.4/10</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-[#f5c96a]">Frontend Developer</span>
                </div>
                <div className="rounded-[28px] bg-white/8 p-5 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-sm text-white/70">
                    <span>Confidence</span>
                    <span>84%</span>
                  </div>
                  <div className="mt-3 h-3 rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '84%' }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-3 rounded-full bg-[#c8601a]"
                    />
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl bg-white/8 px-4 py-4">
                      <p className="text-sm text-white/60">Clarity trend</p>
                      <p className="mt-2 text-2xl font-semibold">Steady up</p>
                    </div>
                    <div className="rounded-3xl bg-white/8 px-4 py-4">
                      <p className="text-sm text-white/60">Next focus</p>
                      <p className="mt-2 text-2xl font-semibold">Examples</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section-shell mt-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              whileHover={{ y: -5, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
              className="surface-card px-6 py-7"
            >
              <p className="text-sm uppercase tracking-[0.18em] text-[#9c9a96]">{stat.label}</p>
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                decimals={stat.decimals}
                className="mt-4 block display-font text-4xl font-bold text-[#0f1f3d]"
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section id="home-process" className="section-shell mt-20">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-8"
        >
          <p className="text-sm uppercase tracking-[0.24em] text-[#c8601a]">How it works</p>
          <h2 className="display-font mt-3 text-4xl font-bold text-[#0f1f3d] md:text-5xl">A three-step rhythm that keeps you practicing.</h2>
        </motion.div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-5 lg:grid-cols-3"
        >
          {process.map((item) => (
            <motion.div
              key={item.step}
              variants={fadeUp}
              whileHover={{ y: -5, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
              className="surface-card border-l-4 border-l-[#c8601a] px-6 py-7"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#c8601a]">{item.step}</p>
              <h3 className="mt-4 text-2xl font-semibold text-[#0f1f3d]">{item.title}</h3>
              <p className="mt-3 text-base leading-7 text-[#5c5a57]">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>


       <LMSCoursesSection />

      <div>
        <SectionDivider />
      </div>

      <section id="home-testimonials" className="section-shell mt-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-8 text-center"
        >
          <p className="text-sm uppercase tracking-[0.24em] text-[#c8601a]">Student stories</p>
          <h2 className="display-font mt-3 text-4xl font-bold text-[#0f1f3d] md:text-5xl">Practice that feels premium is easier to repeat.</h2>
        </motion.div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-5 lg:grid-cols-3"
        >
          {testimonials.map((item) => (
            <motion.div
              key={item.name}
              variants={fadeUp}
              whileHover={{ y: -5, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
              className="surface-card px-6 py-7"
            >
              <p className="display-font text-2xl font-bold text-[#0f1f3d]">“</p>
              <p className="mt-2 text-base leading-7 text-[#5c5a57]">{item.quote}</p>
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#c8601a]">{item.name}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </PageTransition>
  )
}

export default Home
