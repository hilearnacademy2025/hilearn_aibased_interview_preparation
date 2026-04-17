import { motion as Motion } from 'framer-motion'
import HeroSection from '../components/home/HeroSection'
import Features from '../components/home/Features'
import Pricing from '../components/home/Pricing'
import Testimonials from '../components/home/Testimonials'

function Home() {
  return (
    <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <HeroSection />
      <Features />
      <section className="section-shell py-8">
        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="section-card overflow-hidden p-8 lg:p-10"
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">Prep workflow</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Start simple, improve with feedback, return with clarity.</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Every section is intentionally minimal so students can move from setup to practice to analysis without friction.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {['Choose role', 'Answer clearly', 'Review insights'].map((step, index) => (
                <div key={step} className="rounded-[1.4rem] border border-slate-200 bg-white/90 px-5 py-4 text-center shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">0{index + 1}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </Motion.div>
      </section>
      <Pricing />
      <Testimonials />
    </Motion.div>
  )
}

export default Home
