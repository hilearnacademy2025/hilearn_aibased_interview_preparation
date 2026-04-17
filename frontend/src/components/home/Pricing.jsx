

// import { motion as Motion } from 'framer-motion'
// import Button from '../common/Button'
// import { useState } from 'react'

// const plans = [
//   {
//     name: 'Free',
//     price: '₹0',
//     description: 'For students exploring the flow.',
//     features: ['1 live interview flow', 'Basic session recap', 'Resume preview UI'],
//     featured: false,
//     buttonText: 'Choose Free',
//   },
//   {
//     name: 'Pro',
//     price: '₹299',
//     description: 'Best for active placement prep.',
//     features: ['Unlimited interview practice', 'Detailed feedback cards', 'Dashboard tracking'],
//     featured: true,
//     buttonText: 'Choose Pro',
//   },
//   {
//     name: 'Premium',
//     price: '₹799',
//     description: 'For students targeting top offers.',
//     features: ['Priority mentorship surfaces', 'Advanced prep journeys', 'Premium practice packs'],
//     featured: false,
//     buttonText: 'Choose Premium',
//   },
// ]

// function Pricing() {
//   const [hoveredPlan, setHoveredPlan] = useState(null)

//   return (
//     <section id="pricing" className="bg-gradient-to-b from-gray-50 to-white py-24 px-4">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Header Section */}
//         <Motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.5 }}
//           className="text-center"
//         >
//           <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
//             Pricing
//           </p>
//           <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 max-w-3xl mx-auto leading-tight">
//             Simple plans for campus prep, daily practice, and serious interview runs.
//           </h2>
//           <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
//             Choose the plan that works best for your preparation journey.
//           </p>
//         </Motion.div>
        
//         {/* Pricing Cards */}
//         <div className="mt-16 grid gap-8 lg:grid-cols-3">
//           {plans.map((plan, index) => (
//             <Motion.div
//               key={plan.name}
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true, amount: 0.2 }}
//               transition={{ duration: 0.5, delay: index * 0.1 }}
//               whileHover={{ y: -12 }}
//               onMouseEnter={() => setHoveredPlan(index)}
//               onMouseLeave={() => setHoveredPlan(null)}
//               className={`relative rounded-2xl p-8 shadow-xl transition-all duration-300 ${
//                 plan.featured
//                   ? 'border-2 border-blue-500 bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-2xl shadow-blue-500/40'
//                   : 'border border-gray-200 bg-white text-gray-900 shadow-gray-200/50 hover:shadow-2xl'
//               }`}
//             >
              
//               {/* Popular Badge */}
//               {plan.featured && (
//                 <Motion.div
//                   initial={{ scale: 0 }}
//                   whileInView={{ scale: 1 }}
//                   transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
//                   className="absolute -top-4 left-1/2 -translate-x-1/2"
//                 >
//                   <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
//                     🔥 Most Popular
//                   </span>
//                 </Motion.div>
//               )}
              
//               {/* Plan Name */}
//               <h3 className={`text-2xl font-bold ${plan.featured ? 'text-white' : 'text-gray-900'}`}>
//                 {plan.name}
//               </h3>
              
//               {/* Price */}
//               <div className="mt-6">
//                 <p className={`text-5xl font-bold ${plan.featured ? 'text-white' : 'text-gray-900'}`}>
//                   {plan.price}
//                   <span className={`text-base font-medium ${plan.featured ? 'text-blue-100' : 'text-gray-500'}`}>/month</span>
//                 </p>
//                 <p className={`mt-2 text-sm leading-6 ${plan.featured ? 'text-blue-100' : 'text-gray-500'}`}>
//                   Billed monthly
//                 </p>
//               </div>
              
//               {/* Description */}
//               <p className={`mt-4 text-sm leading-7 ${plan.featured ? 'text-blue-100' : 'text-gray-600'}`}>
//                 {plan.description}
//               </p>
              
//               {/* Features List */}
//               <div className="mt-8 space-y-3">
//                 {plan.features.map((feature, idx) => (
//                   <Motion.div
//                     key={feature}
//                     initial={{ opacity: 0, x: -10 }}
//                     whileInView={{ opacity: 1, x: 0 }}
//                     transition={{ delay: index * 0.1 + idx * 0.05 }}
//                     className="flex items-center gap-3 text-sm"
//                   >
//                     <div className={`flex h-5 w-5 items-center justify-center rounded-full ${
//                       plan.featured ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'
//                     }`}>
//                       ✓
//                     </div>
//                     <span className={plan.featured ? 'text-white/90' : 'text-gray-700'}>
//                       {feature}
//                     </span>
//                   </Motion.div>
//                 ))}
//               </div>
              
//               {/* Button - FIXED: Primary variant for all, white text */}
//               <div className="mt-8">
//                 <Button
//                   to="/signup"
//                   variant="primary"
//                   className="w-full text-whit  justify-center py-3 rounded-xl font-semibold"
//                 >
//                   {plan.buttonText}
//                 </Button>
//               </div>
//             </Motion.div>
//           ))}
//         </div>
        
//         {/* Trust Badge */}
//         <Motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ delay: 0.3 }}
//           className="mt-16 text-center"
//         >
//           <div className="inline-flex flex-wrap items-center justify-center gap-4 rounded-full border border-gray-200 bg-white px-6 py-3 shadow-sm">
//             <span className="text-sm text-gray-500">✨ Trusted by 10,000+ students</span>
//             <span className="hidden sm:inline w-px h-4 bg-gray-300" />
//             <span className="text-sm text-gray-500">⭐ 4.9/5 rating</span>
//             <span className="hidden sm:inline w-px h-4 bg-gray-300" />
//             <span className="text-sm text-gray-500">🔄 Cancel anytime</span>
//           </div>
//         </Motion.div>
//       </div>
//     </section>
//   )
// }

// export default Pricing


import { motion as Motion } from 'framer-motion'
import Button from '../common/Button'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const plans = [
  {
    name: 'Free',
    price: '₹0',
    description: 'For students exploring the flow.',
    features: ['1 live interview flow', 'Basic session recap', 'Resume preview UI'],
    featured: false,
    buttonText: 'Choose Free',
    icon: '🎓',
  },
  {
    name: 'Pro',
    price: '₹299',
    description: 'Best for active placement prep.',
    features: ['Unlimited interview practice', 'Detailed feedback cards', 'Dashboard tracking'],
    featured: true,
    buttonText: 'Choose Pro',
    icon: '⚡',
  },
  {
    name: 'Premium',
    price: '₹799',
    description: 'For students targeting top offers.',
    features: ['Priority mentorship surfaces', 'Advanced prep journeys', 'Premium practice packs'],
    featured: false,
    buttonText: 'Choose Premium',
    icon: '🏆',
  },
]

function Pricing() {
  const [hoveredPlan, setHoveredPlan] = useState(null)

  return (
    <section id="pricing" className="bg-gray-100 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
            💰 Pricing
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 max-w-3xl mx-auto leading-tight">
            Simple plans for campus prep, daily practice, and serious interview runs.
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Choose the plan that works best for your preparation journey.
          </p>
        </Motion.div>
        
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <Motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -12 }}
              onMouseEnter={() => setHoveredPlan(index)}
              onMouseLeave={() => setHoveredPlan(null)}
              className={`relative rounded-2xl p-8 shadow-xl transition-all duration-300 ${
                plan.featured
                  ? 'border-2 border-blue-600 bg-gradient-to-br from-blue-700 to-blue-800 text-white shadow-2xl shadow-blue-500/50'
                  : 'border border-blue-200 bg-white text-gray-900 shadow-blue-200/50 hover:shadow-xl'
              }`}
            >
              
              {plan.featured && (
                <Motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2"
                >
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                    🔥 Most Popular
                  </span>
                </Motion.div>
              )}
              
              <div className="text-4xl mb-3">{plan.icon}</div>
              
              <h3 className={`text-2xl font-bold ${plan.featured ? 'text-white' : 'text-gray-900'}`}>
                {plan.name}
              </h3>
              
              <div className="mt-6">
                <p className={`text-5xl font-bold ${plan.featured ? 'text-white' : 'text-gray-900'}`}>
                  {plan.price}
                  <span className={`text-base font-medium ${plan.featured ? 'text-blue-200' : 'text-gray-500'}`}>/month</span>
                </p>
                <p className={`mt-2 text-sm leading-6 ${plan.featured ? 'text-blue-200' : 'text-gray-500'}`}>
                  Billed monthly
                </p>
              </div>
              
              <p className={`mt-4 text-sm leading-7 ${plan.featured ? 'text-blue-100' : 'text-gray-600'}`}>
                {plan.description}
              </p>
              
              <div className="mt-8 space-y-3">
                {plan.features.map((feature, idx) => (
                  <Motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + idx * 0.05 }}
                    className="flex items-center gap-3 text-sm"
                  >
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full ${
                      plan.featured ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'
                    }`}>
                      ✓
                    </div>
                    <span className={plan.featured ? 'text-white/90' : 'text-gray-700'}>
                      {feature}
                    </span>
                  </Motion.div>
                ))}
              </div>
              
              <div className="mt-8">
                <Link to="/signup">
                  <button
                    className={`w-full rounded-xl px-4 py-3 font-semibold transition-all duration-200 cursor-pointer ${
                      plan.featured
                        ? 'bg-white text-blue-700 hover:bg-gray-100 hover:shadow-lg'
                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30'
                    }`}
                  >
                    {plan.buttonText} →
                  </button>
                </Link>
              </div>
            </Motion.div>
          ))}
        </div>
        
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-4 rounded-full border border-gray-200 bg-white px-6 py-3 shadow-md">
            <span className="text-sm text-gray-600">✨ Trusted by 10,000+ students</span>
            <span className="hidden sm:inline w-px h-4 bg-gray-300" />
            <span className="text-sm text-gray-600">⭐ 4.9/5 rating</span>
            <span className="hidden sm:inline w-px h-4 bg-gray-300" />
            <span className="text-sm text-gray-600">🔄 Cancel anytime</span>
          </div>
        </Motion.div>
      </div>
    </section>
  )
}

export default Pricing