// import { AnimatePresence, motion } from 'framer-motion'
// import { useEffect, useState } from 'react'
// import Button from '../components/common/Button'
// import PageTransition from '../components/common/PageTransition'
// import { fadeUp, staggerContainer } from '../components/common/motion'

// const plans = [
//   { name: 'Starter', price: 'Free', description: 'Practice the core flow with a limited round count.', featured: false, perks: ['1 live interview flow', 'Core feedback summary', 'Basic history'] },
//   { name: 'Pro', price: '₹299/mo', description: 'Unlimited practice with the premium motion-rich experience.', featured: true, perks: ['Unlimited interview flows', 'Detailed feedback panels', 'Dashboard insights'] },
//   { name: 'Premium', price: '₹799/mo', description: 'For candidates who want more structure and mentorship touchpoints.', featured: false, perks: ['Everything in Pro', 'Priority support', 'Extended practice packs'] },
// ]

// const faqs = [
//   ['Can I switch plans?', 'Yes. You can move between plans whenever your prep cycle changes.'],
//   ['Is there a free trial?', 'The Starter plan acts as a no-friction way to explore the product before upgrading.'],
//   ['How does billing work?', 'Paid plans are billed monthly and can be canceled any time.'],
//   ['Do you offer student pricing?', 'The Pro plan is already set with student affordability in mind for placement season.'],
// ]

// function PricingPage() {
//   const [openFaq, setOpenFaq] = useState(0)

//   useEffect(() => {
//     document.title = 'Pricing | HiLearn Plans for Interview Prep'
//   }, [])

//   return (
//     <PageTransition>
//       <section className="section-shell">
//         <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
//           <p className="text-sm uppercase tracking-[0.24em] text-[#c8601a]">Pricing</p>
//           <h1 className="display-font mt-4 text-5xl font-bold text-[#0f1f3d] md:text-6xl">Choose a plan that matches your placement season rhythm.</h1>
//           <p className="mt-5 text-lg leading-8 text-[#5c5a57]">
//             The Pro plan is positioned as the hero option with an animated amber border, but every tier keeps the same warm premium visual language.
//           </p>
//         </motion.div>
//       </section>

//       <section className="section-shell mt-16">
//         <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid gap-5 lg:grid-cols-3">
//           {plans.map((plan) => (
//             <motion.div
//               key={plan.name}
//               variants={fadeUp}
//               whileHover={{ y: -5, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
//               className={`${plan.featured ? 'featured-border' : ''} surface-card relative px-6 py-8`}
//             >
//               {plan.featured && <span className="warm-pill absolute right-6 top-6">Most chosen</span>}
//               <p className="text-sm uppercase tracking-[0.22em] text-[#9c9a96]">{plan.name}</p>
//               <p className="mt-5 display-font text-5xl font-bold text-[#0f1f3d]">{plan.price}</p>
//               <p className="mt-4 text-[#5c5a57]">{plan.description}</p>
//               <div className="mt-6 space-y-3">
//                 {plan.perks.map((perk) => (
//                   <div key={perk} className="rounded-2xl border border-[#e0dbd3] bg-[#fffaf4] px-4 py-3 text-sm text-[#5c5a57]">
//                     {perk}
//                   </div>
//                 ))}
//               </div>
//               <Button to="/signup" className="mt-8 w-full justify-center">
//                 Choose {plan.name}
//               </Button>
//             </motion.div>
//           ))}
//         </motion.div>
//       </section>

//       <section className="section-shell mt-20 grid gap-8 lg:grid-cols-[1fr_0.95fr]">
//         <motion.div
//           initial={{ opacity: 0, y: 32 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="surface-card px-6 py-8"
//         >
//           <p className="text-sm uppercase tracking-[0.22em] text-[#c8601a]">Comparison</p>
//           <div className="mt-6 overflow-x-auto">
//             <table className="w-full min-w-[540px] text-left text-sm">
//               <thead>
//                 <tr className="border-b border-[#e0dbd3] text-[#9c9a96]">
//                   <th className="pb-3">Feature</th>
//                   <th className="pb-3">Starter</th>
//                   <th className="pb-3">Pro</th>
//                   <th className="pb-3">Premium</th>
//                 </tr>
//               </thead>
//               <tbody className="text-[#5c5a57]">
//                 {[
//                   ['Interview rounds', '1', 'Unlimited', 'Unlimited'],
//                   ['Feedback detail', 'Core', 'Detailed', 'Advanced'],
//                   ['Dashboard access', 'Limited', 'Full', 'Full'],
//                   ['Priority help', '—', '—', 'Included'],
//                 ].map((row) => (
//                   <tr key={row[0]} className="border-b border-[#f0ebe3]">
//                     {row.map((cell) => (
//                       <td key={cell} className="py-4">{cell}</td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 32 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="navy-panel relative rounded-[32px] p-8"
//         >
//           <p className="text-sm uppercase tracking-[0.24em] text-white/60">Why students upgrade</p>
//           <h2 className="display-font mt-4 text-4xl font-bold">More repetitions, clearer coaching, less friction.</h2>
//           <p className="mt-4 text-white/70">The redesign emphasizes Pro as the premium warm-light offering while keeping the call to action elegant and direct.</p>
//           <div className="mt-8 space-y-3 text-sm text-white/75">
//             <p>Unlimited live sessions</p>
//             <p>Animated dashboard insights</p>
//             <p>Better visibility into strengths and next steps</p>
//           </div>
//         </motion.div>
//       </section>

//       <section className="section-shell mt-20">
//         <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8 text-center">
//           <p className="text-sm uppercase tracking-[0.24em] text-[#c8601a]">FAQ</p>
//           <h2 className="display-font mt-3 text-4xl font-bold text-[#0f1f3d]">Answers without the clutter.</h2>
//         </motion.div>
//         <div className="mx-auto max-w-4xl space-y-4">
//           {faqs.map(([question, answer], index) => {
//             const open = openFaq === index
//             return (
//               <motion.div key={question} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="surface-card overflow-hidden">
//                 <button
//                   type="button"
//                   onClick={() => setOpenFaq(open ? -1 : index)}
//                   className="flex w-full items-center justify-between px-6 py-5 text-left"
//                 >
//                   <span className="text-lg font-semibold text-[#0f1f3d]">{question}</span>
//                   <span className="text-[#c8601a]">{open ? '−' : '+'}</span>
//                 </button>
//                 <AnimatePresence initial={false}>
//                   {open && (
//                     <motion.div
//                       initial={{ height: 0 }}
//                       animate={{ height: 'auto' }}
//                       exit={{ height: 0 }}
//                       className="overflow-hidden"
//                     >
//                       <p className="px-6 pb-5 text-[#5c5a57]">{answer}</p>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </motion.div>
//             )
//           })}
//         </div>
//       </section>
//     </PageTransition>
//   )
// }

// export default PricingPage



import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Button from '../components/common/Button'
import PageTransition from '../components/common/PageTransition'
import { fadeUp, staggerContainer } from '../components/common/motion'

const plans = [
  { name: 'Starter', price: 'Free', description: 'Practice the core flow with a limited round count.', featured: false, perks: ['1 live interview flow', 'Core feedback summary', 'Basic history'] },
  { name: 'Pro', price: '₹299/mo', description: 'Unlimited practice with the premium motion-rich experience.', featured: true, perks: ['Unlimited interview flows', 'Detailed feedback panels', 'Dashboard insights'] },
  { name: 'Premium', price: '₹799/mo', description: 'For candidates who want more structure and mentorship touchpoints.', featured: false, perks: ['Everything in Pro', 'Priority support', 'Extended practice packs'] },
]

const faqs = [
  ['Can I switch plans?', 'Yes. You can move between plans whenever your prep cycle changes.'],
  ['Is there a free trial?', 'The Starter plan acts as a no-friction way to explore the product before upgrading.'],
  ['How does billing work?', 'Paid plans are billed monthly and can be canceled any time.'],
  ['Do you offer student pricing?', 'The Pro plan is already set with student affordability in mind for placement season.'],
]

function PricingPage() {
  const [openFaq, setOpenFaq] = useState(0)

  useEffect(() => {
    document.title = 'Pricing | HiLearn Plans for Interview Prep'
  }, [])

  return (
    <PageTransition>
      <section className="section-shell">
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-[#c8601a]">Pricing</p>
          <h1 className="display-font mt-4 text-5xl font-bold text-[#0f1f3d] md:text-6xl">Choose a plan that matches your placement season rhythm.</h1>
          <p className="mt-5 text-lg leading-8 text-[#5c5a57]">
            The Pro plan is positioned as the hero option with an animated amber border, but every tier keeps the same warm premium visual language.
          </p>
        </motion.div>
      </section>

      <section className="section-shell mt-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              whileHover={{ y: -5, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
              className={`${plan.featured ? 'featured-border' : ''} surface-card relative px-6 py-8`}
            >
              {plan.featured && <span className="warm-pill absolute right-6 top-6">Most chosen</span>}
              <p className="text-sm uppercase tracking-[0.22em] text-[#9c9a96]">{plan.name}</p>
              <p className="mt-5 display-font text-5xl font-bold text-[#0f1f3d]">{plan.price}</p>
              <p className="mt-4 text-[#5c5a57]">{plan.description}</p>
              <div className="mt-6 space-y-3">
                {plan.perks.map((perk) => (
                  <div key={perk} className="rounded-2xl border border-[#e0dbd3] bg-[#fffaf4] px-4 py-3 text-sm text-[#5c5a57]">
                    {perk}
                  </div>
                ))}
              </div>
              <Button to="/signup" className="mt-8 w-full justify-center">
                Choose {plan.name}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="section-shell mt-20 grid gap-8 lg:grid-cols-[1fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="surface-card px-6 py-8"
        >
          <p className="text-sm uppercase tracking-[0.22em] text-[#c8601a]">Comparison</p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[540px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#e0dbd3] text-[#9c9a96]">
                  <th className="pb-3">Feature</th>
                  <th className="pb-3">Starter</th>
                  <th className="pb-3">Pro</th>
                  <th className="pb-3">Premium</th>
                </tr>
              </thead>
              <tbody className="text-[#5c5a57]">
                {[
                  ['Interview rounds', '1', 'Unlimited', 'Unlimited'],
                  ['Feedback detail', 'Core', 'Detailed', 'Advanced'],
                  ['Dashboard access', 'Limited', 'Full', 'Full'],
                  ['Priority help', '—', '—', 'Included'],
                ].map((row, rowIdx) => (
                  <tr key={row[0]} className="border-b border-[#f0ebe3]">
                    {row.map((cell, colIdx) => (
                      <td key={`${row[0]}-${colIdx}`} className="py-4">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="navy-panel relative rounded-[32px] p-8"
        >
          <p className="text-sm uppercase tracking-[0.24em] text-white/60">Why students upgrade</p>
          <h2 className="display-font mt-4 text-4xl font-bold">More repetitions, clearer coaching, less friction.</h2>
          <p className="mt-4 text-white/70">The redesign emphasizes Pro as the premium warm-light offering while keeping the call to action elegant and direct.</p>
          <div className="mt-8 space-y-3 text-sm text-white/75">
            <p>Unlimited live sessions</p>
            <p>Animated dashboard insights</p>
            <p>Better visibility into strengths and next steps</p>
          </div>
        </motion.div>
      </section>

      <section className="section-shell mt-20">
        <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-[#c8601a]">FAQ</p>
          <h2 className="display-font mt-3 text-4xl font-bold text-[#0f1f3d]">Answers without the clutter.</h2>
        </motion.div>
        <div className="mx-auto max-w-4xl space-y-4">
          {faqs.map(([question, answer], index) => {
            const open = openFaq === index
            return (
              <motion.div key={question} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="surface-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(open ? -1 : index)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                >
                  <span className="text-lg font-semibold text-[#0f1f3d]">{question}</span>
                  <span className="text-[#c8601a]">{open ? '−' : '+'}</span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-[#5c5a57]">{answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </section>
    </PageTransition>
  )
}

export default PricingPage