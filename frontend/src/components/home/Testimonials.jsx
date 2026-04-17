

// import { motion as Motion } from 'framer-motion'
// import { useState } from 'react'

// const testimonials = [
//   {
//     name: 'Ananya S.',
//     role: 'Final-year CSE student, Pune',
//     quote: 'The interview flow felt close to placement rounds. I finally knew where my answers sounded vague.',
//     rating: 5,
//     avatar: 'A',
//   },
//   {
//     name: 'Rohit M.',
//     role: 'Frontend intern aspirant, Bengaluru',
//     quote: 'The dashboard and feedback cards made practice feel measurable. I kept coming back because progress was visible.',
//     rating: 5,
//     avatar: 'R',
//   },
//   {
//     name: 'Sneha K.',
//     role: 'Tier-2 college student, Jaipur',
//     quote: 'I liked that it felt polished and not intimidating. It guided me without making me feel behind.',
//     rating: 5,
//     avatar: 'S',
//   },
// ]

// function Testimonials() {
//   const [hoveredIndex, setHoveredIndex] = useState(null)

//   return (
//     <section id="testimonials" className="bg-gradient-to-b from-white to-blue-50/30 py-24 px-4">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Header Section with Animation */}
//         <Motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.5 }}
//           className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
//         >
//           <div>
//             <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
//               ✨ Student stories
//             </p>
//             <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 max-w-2xl leading-tight">
//               Designed to feel supportive when interview prep usually feels stressful.
//             </h2>
//           </div>
//           <p className="text-gray-600 max-w-md text-lg leading-relaxed">
//             Clean hierarchy, calm color, and subtle motion keep the product serious without feeling cold.
//           </p>
//         </Motion.div>
        
//         {/* Testimonials Grid */}
//         <div className="mt-16 grid gap-8 lg:grid-cols-3">
//           {testimonials.map((item, index) => (
//             <Motion.div
//               key={item.name}
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true, amount: 0.2 }}
//               transition={{ duration: 0.5, delay: index * 0.1 }}
//               whileHover={{ y: -10, scale: 1.03 }}
//               onMouseEnter={() => setHoveredIndex(index)}
//               onMouseLeave={() => setHoveredIndex(null)}
//               className="relative rounded-2xl border border-blue-100 bg-white p-8 shadow-lg shadow-blue-100/40 transition-all duration-300 cursor-pointer group overflow-hidden"
//             >
//               {/* Hover Gradient Background */}
//               <Motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white -z-10"
//               />
              
//               {/* Quote Icon */}
//               <Motion.div
//                 animate={{
//                   scale: hoveredIndex === index ? 1.1 : 1,
//                   rotate: hoveredIndex === index ? [0, -5, 5, 0] : 0,
//                 }}
//                 transition={{ duration: 0.4 }}
//                 className="text-5xl mb-4 text-blue-400 opacity-60"
//               >
//                 "
//               </Motion.div>
              
//               {/* Quote Text */}
//               <p className="text-base leading-8 text-gray-700 relative z-10">
//                 {item.quote}
//               </p>
              
//               {/* Rating Stars */}
//               <div className="mt-4 flex gap-1">
//                 {[...Array(5)].map((_, i) => (
//                   <svg
//                     key={i}
//                     className={`w-4 h-4 ${
//                       i < item.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
//                     }`}
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                   </svg>
//                 ))}
//               </div>
              
//               {/* Author */}
//               <footer className="mt-6 flex items-center gap-3">
//                 <Motion.div
//                   animate={{
//                     scale: hoveredIndex === index ? 1.05 : 1,
//                     backgroundColor: hoveredIndex === index ? '#2563EB' : '#3B82F6',
//                   }}
//                   transition={{ duration: 0.3 }}
//                   className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold shadow-md shadow-blue-500/30"
//                 >
//                   {item.avatar}
//                 </Motion.div>
//                 <div>
//                   <p className="font-bold text-gray-900">{item.name}</p>
//                   <p className="text-sm text-gray-500">{item.role}</p>
//                 </div>
//               </footer>
              
//               {/* Decorative Quote Mark */}
//               <div className="absolute bottom-4 right-4 text-7xl font-bold text-blue-100/30 -z-10">
//                 "
//               </div>
//             </Motion.div>
//           ))}
//         </div>
        
//         {/* Trust Indicator */}
//         <Motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ delay: 0.3 }}
//           className="mt-16 text-center"
//         >
//           <div className="inline-flex flex-wrap items-center justify-center gap-6 rounded-full border border-gray-200 bg-white px-8 py-4 shadow-sm">
//             <div className="flex items-center gap-2">
//               <span className="text-2xl">⭐</span>
//               <span className="text-sm text-gray-600">4.9/5 from 10,000+ students</span>
//             </div>
//             <div className="hidden sm:inline w-px h-6 bg-gray-200" />
//             <div className="flex items-center gap-2">
//               <span className="text-2xl">🏆</span>
//               <span className="text-sm text-gray-600">Top rated interview prep platform</span>
//             </div>
//           </div>
//         </Motion.div>
//       </div>
//     </section>
//   )
// }

// export default Testimonials

import { motion as Motion } from 'framer-motion'
import { useState } from 'react'

const testimonials = [
  {
    name: 'Ananya S.',
    role: 'Final-year CSE student, Pune',
    quote: 'The interview flow felt close to placement rounds. I finally knew where my answers sounded vague.',
    rating: 5,
    avatar: 'A',
  },
  {
    name: 'Rohit M.',
    role: 'Frontend intern aspirant, Bengaluru',
    quote: 'The dashboard and feedback cards made practice feel measurable. I kept coming back because progress was visible.',
    rating: 5,
    avatar: 'R',
  },
  {
    name: 'Sneha K.',
    role: 'Tier-2 college student, Jaipur',
    quote: 'I liked that it felt polished and not intimidating. It guided me without making me feel behind.',
    rating: 5,
    avatar: 'S',
  },
]

function Testimonials() {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  return (
    <section id="testimonials" className="bg-gradient-to-b from-gray-100 to-white py-24 px-4">
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
              ✨ Student stories
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 max-w-2xl leading-tight">
              Designed to feel supportive when interview prep usually feels stressful.
            </h2>
          </div>
          <p className="text-gray-600 max-w-md text-lg leading-relaxed">
            Clean hierarchy, calm color, and subtle motion keep the product serious without feeling cold.
          </p>
        </Motion.div>
        
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <Motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.03 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative rounded-2xl border border-blue-200 bg-white p-8 shadow-lg shadow-blue-200/50 transition-all duration-300 cursor-pointer group overflow-hidden"
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
                className="text-5xl mb-4 text-blue-400 opacity-60"
              >
                "
              </Motion.div>
              
              <p className="text-base leading-8 text-gray-700 relative z-10">
                {item.quote}
              </p>
              
              <div className="mt-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < item.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              <footer className="mt-6 flex items-center gap-3">
                <Motion.div
                  animate={{
                    scale: hoveredIndex === index ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold shadow-md shadow-blue-500/40"
                >
                  {item.avatar}
                </Motion.div>
                <div>
                  <p className="font-bold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.role}</p>
                </div>
              </footer>
              
              <div className="absolute bottom-4 right-4 text-7xl font-bold text-blue-100/40 -z-10">
                "
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
          <div className="inline-flex flex-wrap items-center justify-center gap-6 rounded-full border border-gray-200 bg-white px-8 py-4 shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <span className="text-sm text-gray-600">4.9/5 from 10,000+ students</span>
            </div>
            <div className="hidden sm:inline w-px h-6 bg-gray-200" />
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <span className="text-sm text-gray-600">Top rated interview prep platform</span>
            </div>
          </div>
        </Motion.div>
      </div>
    </section>
  )
}

export default Testimonials