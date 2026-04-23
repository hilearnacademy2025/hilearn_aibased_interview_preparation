
import { motion as Motion } from 'framer-motion'
import Button from '../common/Button'
import { useState } from 'react'

const stats = [
  { label: 'Interview Styles', value: '4', icon: '🎯' },
  { label: 'Avg. Session', value: '28 min', icon: '⏱️' },
  { label: 'Confidence Lift', value: '92%', icon: '📈' },
]

function HeroSection() {
  const [hoveredStat, setHoveredStat] = useState(null)

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Blue Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900" />
      
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-300/20 blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-12 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          
          {/* Left Content */}
          <Motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
            className="space-y-8"
          >
            {/* Badge */}
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex"
            >
              <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
                <span className="text-sm font-medium text-white/90">
                  🚀 Modern interview practice for learning-focused students
                </span>
              </div>
            </Motion.div>

            {/* Heading */}
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white">
                A cleaner way to practice interviews,
                <br />
                build confidence,
                <br />
                and improve every round.
              </h1>
              
              <p className="text-lg leading-8 text-blue-100 max-w-xl">
                HiLearn turns interview prep into a smooth, focused learning experience with structured mock sessions,
                clear feedback, and a modern interface that stays out of your way.
              </p>
            </Motion.div>

            {/* Buttons */}
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button 
                to="/interview" 
                variant="primary" 
                className="px-8 py-3.5 text-white text-base rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
              >
                ✨ Start practicing
              </Button>
              <Button 
                to="/dashboard" 
                variant="secondary" 
                className="px-8 py-3.5 text-base rounded-xl"
              >
                📊 View progress
              </Button>
            </Motion.div>

            {/* Stats */}
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-4 pt-4"
            >
              {stats.map((stat, idx) => (
                <Motion.div
                  key={stat.label}
                  onMouseEnter={() => setHoveredStat(idx)}
                  onMouseLeave={() => setHoveredStat(null)}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="relative rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-4 cursor-pointer transition-all duration-300"
                >
                  <Motion.div
                    animate={{
                      scale: hoveredStat === idx ? [1, 1.2, 1] : 1,
                      rotate: hoveredStat === idx ? [0, 10, -10, 0] : 0
                    }}
                    transition={{ duration: 0.5 }}
                    className="text-2xl mb-2"
                  >
                    {stat.icon}
                  </Motion.div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-blue-200 mt-1">{stat.label}</p>
                  
                  {hoveredStat === idx && (
                    <Motion.div
                      layoutId="statGlow"
                      className="absolute inset-0 rounded-2xl bg-white/10 -z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </Motion.div>
              ))}
            </Motion.div>
          </Motion.div>

          {/* Right Content - Card */}
          <Motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 100 }}
            className="relative"
          >
            <div className="relative rounded-3xl bg-gradient-to-br from-white to-blue-50 p-1 shadow-2xl shadow-blue-900/30">
              <div className="rounded-2xl bg-white p-6">
                
                {/* Card Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-1">
                        <div className="h-3 w-3 rounded-full bg-red-500" />
                        <div className="h-3 w-3 rounded-full bg-yellow-500" />
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                      </div>
                      <span className="text-xs text-gray-400">live_session.ai</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Frontend Developer Interview</h3>
                  </div>
                  <div className="rounded-full bg-blue-100 px-3 py-1">
                    <span className="text-xs font-semibold text-blue-700 animate-pulse">● Live</span>
                  </div>
                </div>

                {/* AI Question */}
                <div className="mb-6 rounded-xl bg-gray-900 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-gray-400">🤖 AI interviewer</span>
                    <span className="text-xs text-gray-500">asks</span>
                  </div>
                  <p className="text-white leading-relaxed">
                    How would you optimize a React dashboard that becomes sluggish when users filter large datasets?
                  </p>
                </div>

                {/* Scores Grid */}
                <div className="grid gap-4 sm:grid-cols-2 mb-6">
                  <Motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="rounded-xl bg-gradient-to-br from-blue-50 to-white p-4 border border-blue-100"
                  >
                    <p className="text-xs text-gray-500 mb-1">Clarity Score</p>
                    <p className="text-3xl font-bold text-blue-600">8.8</p>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-blue-100">
                      <Motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '88%' }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                      />
                    </div>
                  </Motion.div>
                  
                  <Motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="rounded-xl bg-white p-4 border border-gray-100 shadow-sm"
                  >
                    <p className="text-xs text-gray-500 mb-1">Suggested Focus</p>
                    <p className="text-sm font-medium text-gray-800 leading-relaxed">
                      State management, memoized views, chunked rendering
                    </p>
                  </Motion.div>
                </div>

                {/* Feature Tags */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {['Voice feedback', 'STAR prompts', 'Role-based rounds'].map((item, idx) => (
                    <Motion.div
                      key={idx}
                      whileHover={{ y: -2, scale: 1.05 }}
                      className="rounded-full border border-gray-200 bg-white px-3 py-2 text-center text-xs font-medium text-gray-700 shadow-sm hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                    >
                      {idx === 0 && '🎤'} {idx === 1 && '📝'} {idx === 2 && '🎯'} {item}
                    </Motion.div>
                  ))}
                </div>

                {/* Bottom Banner */}
                <Motion.div 
                  whileHover={{ scale: 1.01 }}
                  className="rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 p-4 text-white shadow-lg shadow-blue-500/30"
                >
                  <p className="text-xs text-blue-100 mb-1">✨ Why this works</p>
                  <p className="text-sm font-medium">
                    Simple visuals reduce distraction and keep students focused on their answers.
                  </p>
                </Motion.div>
              </div>
            </div>

            {/* Floating Element */}
            <Motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 rounded-full bg-white p-2 shadow-lg"
            >
              <span className="text-blue-600 text-sm">✨</span>
            </Motion.div>
          </Motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection