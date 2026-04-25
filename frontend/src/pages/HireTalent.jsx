import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Users, Zap, ShieldCheck, Clock, BarChart3, Wallet, Briefcase } from 'lucide-react'
import Button from '../components/common/Button'
import PageTransition from '../components/common/PageTransition'
import SectionDivider from '../components/common/SectionDivider'
import { fadeUp, staggerContainer } from '../components/common/motion'

const benefits = [
  {
    icon: <Zap size={24} />,
    title: 'AI-Powered Candidate Matching',
    description: 'Our proprietary AI analyzes skills, communication patterns, and problem-solving approaches to match you with top-tier candidates.',
  },
  {
    icon: <Clock size={24} />,
    title: 'Streamlined Hiring Process',
    description: 'Reduce time-to-hire by 60%. Review detailed interview analytics and skip the repetitive screening rounds.',
  },
  {
    icon: <ShieldCheck size={24} />,
    title: 'Pre-vetted Talent Database',
    description: 'Access candidates who have already proven their skills in our rigorous, AI-driven mock interview environment.',
  },
  {
    icon: <Briefcase size={24} />,
    title: 'Quick Job Postings',
    description: 'Publish your roles instantly to thousands of active learners and job seekers focused on upskilling.',
  },
  {
    icon: <BarChart3 size={24} />,
    title: 'Detailed Analytics',
    description: 'Get deep insights into a candidate\'s technical proficiency, communication clarity, and confidence metrics.',
  },
  {
    icon: <Wallet size={24} />,
    title: 'Affordable Pricing',
    description: 'Premium hiring tools without the enterprise price tag. Simple, transparent pricing that scales with your team.',
  },
]

const features = [
  {
    step: '01',
    title: 'Post a role',
    description: 'Create a job posting with specific technical requirements and soft skill expectations.',
  },
  {
    step: '02',
    title: 'Review AI-vetted matches',
    description: 'Instantly receive a shortlist of candidates whose interview scores align with your needs.',
  },
  {
    step: '03',
    title: 'Hire with confidence',
    description: 'Access full interview playbacks, strength analysis, and code quality reviews before making an offer.',
  },
]

function HireTalent() {
  const location = useLocation()

  useEffect(() => {
    document.title = 'Hire Talent | HiLearn For Companies'
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
              For Forward-Thinking Companies
            </motion.span>
            <motion.h1 variants={fadeUp} className="display-font max-w-3xl text-5xl font-bold leading-tight text-[#0f1f3d] md:text-7xl">
              Find and Hire <span className="shimmer-text">Top Tech Talent</span> effortlessly.
            </motion.h1>
            <motion.p variants={fadeUp} className="max-w-2xl text-lg leading-8 text-[#5c5a57]">
              Skip the resume screening. Connect directly with pre-vetted candidates based on their actual performance in AI-driven mock interviews.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Button to="/company/register" className="px-7 py-4 text-base">
                Sign Up for Free
              </Button>
              <Button to="/company/login" variant="secondary" className="px-7 py-4 text-base">
                Login
              </Button>
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              {['No upfront costs', 'Data-driven hiring', 'Zero spam'].map((pill) => (
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
                    <p className="text-sm uppercase tracking-[0.24em] text-white/60">Candidate Match Score</p>
                    <p className="mt-2 display-font text-5xl font-bold">94%</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-[#f5c96a]">Full Stack Dev</span>
                </div>
                <div className="rounded-[28px] bg-white/8 p-5 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-sm text-white/70">
                    <span>Problem Solving</span>
                    <span>9.2/10</span>
                  </div>
                  <div className="mt-3 h-3 rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '92%' }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-3 rounded-full bg-[#c8601a]"
                    />
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl bg-white/8 px-4 py-4">
                      <p className="text-sm text-white/60">Communication</p>
                      <p className="mt-2 text-2xl font-semibold">Clear & Concise</p>
                    </div>
                    <div className="rounded-3xl bg-white/8 px-4 py-4">
                      <p className="text-sm text-white/60">System Design</p>
                      <p className="mt-2 text-2xl font-semibold">Strong</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section-shell mt-20">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-8"
        >
          <p className="text-sm uppercase tracking-[0.24em] text-[#c8601a]">Why HiLearn</p>
          <h2 className="display-font mt-3 text-4xl font-bold text-[#0f1f3d] md:text-5xl">Everything you need to scale your engineering team.</h2>
        </motion.div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {benefits.map((benefit, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              whileHover={{ y: -5, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
              className="surface-card px-6 py-7 flex flex-col items-start"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c8601a]/10 text-[#c8601a] mb-5">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold text-[#0f1f3d]">{benefit.title}</h3>
              <p className="mt-3 text-base leading-7 text-[#5c5a57]">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section id="how-it-works" className="section-shell mt-20">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-8"
        >
          <p className="text-sm uppercase tracking-[0.24em] text-[#c8601a]">How it works</p>
          <h2 className="display-font mt-3 text-4xl font-bold text-[#0f1f3d] md:text-5xl">A seamless workflow from posting to offer.</h2>
        </motion.div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-5 lg:grid-cols-3"
        >
          {features.map((item) => (
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

      <div>
        <SectionDivider />
      </div>

      <section id="pricing" className="section-shell mt-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-8 text-center"
        >
          <p className="text-sm uppercase tracking-[0.24em] text-[#c8601a]">Pricing</p>
          <h2 className="display-font mt-3 text-4xl font-bold text-[#0f1f3d] md:text-5xl">Simple pricing for growing teams.</h2>
        </motion.div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto"
        >
          {/* Free Plan */}
          <motion.div
            variants={fadeUp}
            whileHover={{ y: -5, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
            className="surface-card px-8 py-10 flex flex-col"
          >
            <h3 className="text-2xl font-bold text-[#0f1f3d]">Free</h3>
            <div className="mt-4 flex items-baseline text-4xl font-extrabold text-[#0f1f3d]">
              ₹0<span className="ml-1 text-xl font-medium text-[#5c5a57]">/mo</span>
            </div>
            <p className="mt-4 text-[#5c5a57]">Perfect for trying out the platform.</p>
            <ul className="mt-8 space-y-4 flex-1">
              {['1 Active Job Post', 'Basic Candidate Filtering', 'Limited Profile Views', 'Standard Support'].map((feature, i) => (
                <li key={i} className="flex items-center text-sm text-[#5c5a57]">
                  <span className="mr-3 text-[#c8601a]">✓</span> {feature}
                </li>
              ))}
            </ul>
            <Button to="/company/register" variant="secondary" className="mt-8 w-full justify-center">
              Get Started
            </Button>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            variants={fadeUp}
            whileHover={{ y: -5, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
            className="navy-panel relative px-8 py-10 flex flex-col overflow-hidden rounded-[32px]"
          >
            <div className="absolute top-0 right-0 rounded-bl-2xl bg-[#c8601a] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">Popular</div>
            <h3 className="text-2xl font-bold text-white">Pro</h3>
            <div className="mt-4 flex items-baseline text-4xl font-extrabold text-white">
              ₹499<span className="ml-1 text-xl font-medium text-white/70">/mo</span>
            </div>
            <p className="mt-4 text-white/80">For growing startups and agencies.</p>
            <ul className="mt-8 space-y-4 flex-1">
              {['Unlimited Job Posts', 'Advanced AI Matching', 'Full Analytics Access', 'Direct Candidate Messaging', 'Priority Support'].map((feature, i) => (
                <li key={i} className="flex items-center text-sm text-white/90">
                  <span className="mr-3 text-[#f5c96a]">✓</span> {feature}
                </li>
              ))}
            </ul>
            <Button to="/company/register" className="mt-8 w-full justify-center bg-[#c8601a] text-white hover:bg-[#b0541a]">
              Upgrade to Pro
            </Button>
          </motion.div>

          {/* Enterprise Plan */}
          <motion.div
            variants={fadeUp}
            whileHover={{ y: -5, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
            className="surface-card px-8 py-10 flex flex-col"
          >
            <h3 className="text-2xl font-bold text-[#0f1f3d]">Enterprise</h3>
            <div className="mt-4 flex items-baseline text-4xl font-extrabold text-[#0f1f3d]">
              Custom
            </div>
            <p className="mt-4 text-[#5c5a57]">For large scale hiring operations.</p>
            <ul className="mt-8 space-y-4 flex-1">
              {['Custom Integrations', 'Dedicated Account Manager', 'Custom Assessment Creation', 'White-labeled Experience', 'SLA Guarantee'].map((feature, i) => (
                <li key={i} className="flex items-center text-sm text-[#5c5a57]">
                  <span className="mr-3 text-[#c8601a]">✓</span> {feature}
                </li>
              ))}
            </ul>
            <Button to="/about" variant="secondary" className="mt-8 w-full justify-center">
              Contact Sales
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <section className="section-shell mt-24 mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="navy-panel mx-auto max-w-4xl overflow-hidden rounded-[40px] px-6 py-16 sm:px-12 relative"
        >
           <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="ambient-blob top-0 left-0 h-full w-full bg-[#c8601a]/20"
            />
          <div className="relative z-10">
            <h2 className="display-font text-4xl font-bold text-white md:text-5xl">Ready to transform your hiring?</h2>
            <p className="mt-6 text-lg text-white/80">
              Join top companies hiring the best pre-vetted talent on HiLearn.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button to="/company/register" className="px-8 py-4 text-lg">
                Sign Up Now
              </Button>
              <Button to="/company/login" variant="white" className="px-8 py-4 text-lg">
                Login
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

    </PageTransition>
  )
}

export default HireTalent
