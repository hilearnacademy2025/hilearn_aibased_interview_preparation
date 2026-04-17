

// import { motion as Motion } from 'framer-motion'
// import PricingSection from '../components/home/Pricing'
// import { Link } from 'react-router-dom'

// function PricingPage() {
//   return (
//     <Motion.div
//       initial={{ opacity: 0, y: 14 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="min-h-screen bg-gray-50 py-8 px-4"
//     >
//       <div className="max-w-7xl mx-auto">
        
//         {/* Hero Banner */}
//         <Motion.div
//           initial={{ opacity: 0, scale: 0.98 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.5 }}
//           className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 p-8 text-white shadow-xl shadow-blue-500/30 mb-8"
//         >
//           {/* Animated Background Orbs */}
//           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
//           <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32" />
          
//           <div className="relative z-10 ">
//             <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-100">
//               💎 Plans
//             </p>
//             <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
//               Pick the plan that matches your placement season.
//             </h1>
//             <p className="mt-4 max-w-2xl text-base leading-7 text-blue-100">
//               The Pro plan is emphasized for students who want regular practice without overcomplicating choices.
//             </p>
            
//             {/* Trust Badges */}
//             <div className="mt-6 flex flex-wrap gap-4">
//               <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur-sm">
//                 <span className="text-sm">⭐</span>
//                 <span className="text-sm font-medium">4.9/5 rating</span>
//               </div>
//               <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur-sm">
//                 <span className="text-sm">🎓</span>
//                 <span className="text-sm font-medium">10,000+ students</span>
//               </div>
//               <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur-sm">
//                 <span className="text-sm">🔄</span>
//                 <span className="text-sm font-medium">Cancel anytime</span>
//               </div>
//             </div>
//           </div>
//         </Motion.div>

//         {/* FAQ Section */}
//         <Motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3, duration: 0.5 }}
//           className="mt-12 text-center"
//         >
//           <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
//             ❓ Frequently Asked Questions
//           </h2>
//           <p className="text-gray-500 mb-8">Everything you need to know about our plans</p>
          
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
//             {[
//               { q: 'Can I switch plans?', a: 'Yes, you can upgrade or downgrade anytime.' },
//               { q: 'Is there a free trial?', a: 'Free plan includes 1 live interview flow.' },
//               { q: 'Do I need a credit card?', a: 'No, start with free plan instantly.' },
//             ].map((faq, idx) => (
//               <Motion.div
//                 key={idx}
//                 whileHover={{ y: -5, scale: 1.02 }}
//                 className="rounded-xl border border-blue-100 bg-white p-5 text-left shadow-md shadow-blue-100/40 transition-all duration-300 cursor-pointer"
//               >
//                 <h3 className="font-semibold text-gray-900">{faq.q}</h3>
//                 <p className="text-sm text-gray-500 mt-2">{faq.a}</p>
//               </Motion.div>
//             ))}
//           </div>
//         </Motion.div>

//         {/* CTA Section */}
//         <Motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4, duration: 0.5 }}
//           className="mt-12 rounded-2xl bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 p-8 text-center border border-blue-100"
//         >
//           <h2 className="text-2xl font-bold text-white mb-2">
//             🚀 Still have questions?
//           </h2>
//           <p className="text-white mb-4">
//             Our team is here to help you choose the right plan for your preparation journey.
//           </p>
//           <Link to="/contact">
//             <button className="inline-flex items-center gap-2 rounded-xl border border-blue-300 bg-white px-6 py-3 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50 hover:shadow-md transition-all duration-200 cursor-pointer">
//               Contact Support
//               <span>→</span>
//             </button>
//           </Link>
//         </Motion.div>
//       </div>

//       {/* Pricing Section */}
//       <PricingSection />
//     </Motion.div>
//   )
// }

// export default PricingPage

import { motion as Motion } from 'framer-motion'
import PricingSection from '../components/home/Pricing'
import { Link } from 'react-router-dom'

function PricingPage() {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-100 py-8 px-4"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Hero Banner - Darker */}
        <Motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 p-8 text-white shadow-xl shadow-blue-500/30 mb-8"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32" />
          
          <div className="relative z-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-100">
              💎 Plans
            </p>
            <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
              Pick the plan that matches your placement season.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-blue-100">
              The Pro plan is emphasized for students who want regular practice without overcomplicating choices.
            </p>
            
            {/* Trust Badges */}
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur-sm">
                <span className="text-sm">⭐</span>
                <span className="text-sm font-medium">4.9/5 rating</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur-sm">
                <span className="text-sm">🎓</span>
                <span className="text-sm font-medium">10,000+ students</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur-sm">
                <span className="text-sm">🔄</span>
                <span className="text-sm font-medium">Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur-sm">
                <span className="text-sm">💳</span>
                <span className="text-sm font-medium">No hidden fees</span>
              </div>
            </div>
          </div>
        </Motion.div>

        {/* Comparison Table - New Section */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-12 rounded-2xl border border-blue-200 bg-white p-6 shadow-lg shadow-blue-200/50"
        >
          <h2 className="text-xl font-bold text-gray-900 text-center mb-6">
            📊 Plan Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600">Features</th>
                  <th className="text-center py-3 px-4 text-gray-900 font-semibold">Free</th>
                  <th className="text-center py-3 px-4 text-blue-600 font-semibold bg-blue-50/50 rounded-t-lg">Pro</th>
                  <th className="text-center py-3 px-4 text-gray-900 font-semibold">Premium</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Live interview flows', free: '1', pro: 'Unlimited', premium: 'Unlimited' },
                  { feature: 'Feedback cards', free: 'Basic', pro: 'Detailed', premium: 'Advanced' },
                  { feature: 'Dashboard tracking', free: '❌', pro: '✅', premium: '✅' },
                  { feature: 'Priority mentorship', free: '❌', pro: '❌', premium: '✅' },
                  { feature: 'Practice packs', free: 'Basic', pro: 'Standard', premium: 'Premium' },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700">{row.feature}</td>
                    <td className="text-center py-3 px-4 text-gray-500">{row.free}</td>
                    <td className="text-center py-3 px-4 text-blue-600 font-medium">{row.pro}</td>
                    <td className="text-center py-3 px-4 text-gray-500">{row.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Motion.div>

        {/* FAQ Section - Darker Cards */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            ❓ Frequently Asked Questions
          </h2>
          <p className="text-gray-500 mb-8">Everything you need to know about our plans</p>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
            {[
              { q: 'Can I switch plans?', a: 'Yes, you can upgrade or downgrade anytime.' },
              { q: 'Is there a free trial?', a: 'Free plan includes 1 live interview flow.' },
              { q: 'Do I need a credit card?', a: 'No, start with free plan instantly.' },
              { q: 'Can I cancel anytime?', a: 'Yes, no questions asked cancellation.' },
              { q: 'Is there student discount?', a: 'Contact us for special student pricing.' },
              { q: 'How does billing work?', a: 'Monthly subscription, cancel anytime.' },
            ].map((faq, idx) => (
              <Motion.div
                key={idx}
                whileHover={{ y: -5, scale: 1.02 }}
                className="rounded-xl border border-blue-200 bg-white p-5 text-left shadow-md shadow-blue-200/50 transition-all duration-300 cursor-pointer"
              >
                <h3 className="font-semibold text-gray-900">{faq.q}</h3>
                <p className="text-sm text-gray-500 mt-2">{faq.a}</p>
              </Motion.div>
            ))}
          </div>
        </Motion.div>

        {/* Money Back Guarantee - New Section */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-6 py-3 shadow-sm">
            <span className="text-xl">💰</span>
            <span className="text-sm text-green-700 font-medium">30-day money-back guarantee</span>
            <span className="text-green-600">•</span>
            <span className="text-sm text-green-600">No questions asked</span>
          </div>
        </Motion.div>

        {/* CTA Section - Darker */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-12 rounded-2xl bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 p-8 text-center shadow-xl shadow-blue-500/30"
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            🚀 Still have questions?
          </h2>
          <p className="text-blue-100 mb-6">
            Our team is here to help you choose the right plan for your preparation journey.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact">
              <button className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-blue-600 shadow-md hover:bg-gray-50 hover:shadow-lg transition-all duration-200 cursor-pointer">
                📧 Contact Support
                <span>→</span>
              </button>
            </Link>
            <Link to="/signup">
              <button className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-all duration-200 cursor-pointer">
                🎯 Start Free Trial
                <span>→</span>
              </button>
            </Link>
          </div>
        </Motion.div>
      </div>

      {/* Pricing Section */}
      <PricingSection />
    </Motion.div>
  )
}

export default PricingPage