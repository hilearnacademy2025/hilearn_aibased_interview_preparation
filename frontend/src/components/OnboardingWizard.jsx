import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, X, Briefcase, BarChart3, Rocket, Check, Loader2 } from 'lucide-react'
import { updateProfileApi } from '../utils/api'

const ROLES = [
  'Backend Engineer', 'Frontend Developer', 'Full Stack Developer',
  'DevOps Engineer', 'Data Scientist', 'Data Analyst',
  'Machine Learning Engineer', 'Mobile Developer', 'QA Engineer',
  'Product Manager', 'Cloud Architect', 'Cybersecurity Analyst',
]

const LEVELS = [
  { value: 'junior', label: 'Junior', desc: '0–2 years experience', icon: '🌱' },
  { value: 'mid', label: 'Mid-Level', desc: '2–5 years experience', icon: '🚀' },
  { value: 'senior', label: 'Senior', desc: '5+ years experience', icon: '⭐' },
]

const steps = [
  { title: 'Select Your Target Role', icon: Briefcase },
  { title: 'Experience Level', icon: BarChart3 },
  { title: 'Start Your Journey', icon: Rocket },
]

export default function OnboardingWizard({ onComplete }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [role, setRole] = useState('')
  const [level, setLevel] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSkip = () => {
    localStorage.setItem('hasCompletedOnboarding', 'true')
    if (onComplete) onComplete()
  }

  const handleNext = () => {
    if (step < 2) {
      setStep(s => s + 1)
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1)
  }

  const handleStart = async () => {
    localStorage.setItem('hasCompletedOnboarding', 'true')
    if (role) localStorage.setItem('hilearn_target_role', role)
    if (level) localStorage.setItem('hilearn_experience_level', level)
    
    try {
      setIsSubmitting(true)
      await updateProfileApi({ target_role: role, experience_level: level })
    } catch (err) {
      console.error('Failed to save preferences:', err)
    } finally {
      setIsSubmitting(false)
      if (onComplete) onComplete()
      navigate('/user/interview-setup')
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(15, 31, 61, 0.7)',
      backdropFilter: 'blur(8px)',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        style={{
          background: 'white',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '520px',
          margin: '0 16px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0f1f3d 0%, #1a3a6b 100%)',
          padding: '24px 28px 20px',
          position: 'relative',
        }}>
          <button
            onClick={handleSkip}
            style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'rgba(255,255,255,0.15)', border: 'none',
              borderRadius: '50%', width: '32px', height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'rgba(255,255,255,0.7)',
            }}
          >
            <X size={16} />
          </button>
          <p style={{ color: '#c8601a', fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', margin: 0 }}>
            Welcome to HiLearn
          </p>
          <h2 style={{ color: 'white', fontSize: '22px', fontWeight: 700, margin: '6px 0 0' }}>
            Let's personalize your experience
          </h2>

          {/* Progress bar */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '16px' }}>
            {steps.map((_, i) => (
              <div key={i} style={{
                flex: 1, height: '4px', borderRadius: '4px',
                background: i <= step ? 'linear-gradient(90deg, #c8601a, #f07d2e)' : 'rgba(255,255,255,0.15)',
                transition: 'background 0.3s ease',
              }} />
            ))}
          </div>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
            {steps.map((s, i) => {
              const Icon = s.icon
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  opacity: i === step ? 1 : 0.4,
                  transition: 'opacity 0.3s',
                }}>
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '8px',
                    background: i <= step ? '#c8601a' : 'rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {i < step ? <Check size={12} color="white" /> : <Icon size={12} color="white" />}
                  </div>
                  {i === step && (
                    <span style={{ color: 'white', fontSize: '12px', fontWeight: 600 }}>{s.title}</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px 28px 28px', minHeight: '260px' }}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <p style={{ fontSize: '14px', color: '#5c5a57', marginBottom: '16px' }}>
                  What role are you preparing for?
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
                  {ROLES.map(r => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: `2px solid ${role === r ? '#c8601a' : '#e0dbd3'}`,
                        background: role === r ? '#c8601a10' : 'white',
                        color: role === r ? '#c8601a' : '#5c5a57',
                        fontSize: '13px',
                        fontWeight: role === r ? 600 : 500,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s',
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <p style={{ fontSize: '14px', color: '#5c5a57', marginBottom: '16px' }}>
                  How experienced are you?
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {LEVELS.map(l => (
                    <button
                      key={l.value}
                      onClick={() => setLevel(l.value)}
                      style={{
                        padding: '16px 18px',
                        borderRadius: '14px',
                        border: `2px solid ${level === l.value ? '#c8601a' : '#e0dbd3'}`,
                        background: level === l.value ? '#c8601a08' : 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s',
                      }}
                    >
                      <span style={{ fontSize: '28px' }}>{l.icon}</span>
                      <div>
                        <p style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: level === l.value ? '#c8601a' : '#0f1f3d' }}>
                          {l.label}
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9c9a96' }}>{l.desc}</p>
                      </div>
                      {level === l.value && (
                        <Check size={18} color="#c8601a" style={{ marginLeft: 'auto' }} />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                style={{ textAlign: 'center', paddingTop: '16px' }}
              >
                <div style={{ fontSize: '56px', marginBottom: '12px' }}>🎯</div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0f1f3d', margin: '0 0 8px' }}>
                  You're all set!
                </h3>
                <p style={{ fontSize: '14px', color: '#5c5a57', lineHeight: 1.6 }}>
                  {role && <><strong>{role}</strong> · </>}
                  {level && <><span style={{ textTransform: 'capitalize' }}>{level}</span> level · </>}
                  Let's ace your interview!
                </p>

                <div style={{
                  marginTop: '20px', padding: '16px', borderRadius: '14px',
                  background: 'linear-gradient(135deg, #0f1f3d08, #c8601a08)',
                  border: '1px solid #e0dbd3',
                }}>
                  <p style={{ fontSize: '13px', color: '#5c5a57', margin: 0 }}>
                    ✨ AI-powered questions tailored to your role<br />
                    📊 Real-time feedback and scoring<br />
                    🎤 Voice + text interview modes
                  </p>
                </div>

                <button
                  onClick={handleStart}
                  disabled={isSubmitting}
                  style={{
                    marginTop: '20px',
                    width: '100%',
                    padding: '14px',
                    borderRadius: '50px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #c8601a, #e07030)',
                    color: 'white',
                    fontSize: '15px',
                    fontWeight: 700,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 6px 20px rgba(200,96,26,0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                >
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Rocket size={16} />} 
                  {isSubmitting ? 'Saving...' : 'Start Your First Interview'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer nav */}
        {step < 2 && (
          <div style={{
            padding: '0 28px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <button
              onClick={handleSkip}
              style={{
                background: 'none', border: 'none', color: '#9c9a96',
                fontSize: '13px', cursor: 'pointer', fontWeight: 500,
              }}
            >
              Skip for now
            </button>
            <div style={{ display: 'flex', gap: '8px' }}>
              {step > 0 && (
                <button
                  onClick={handleBack}
                  style={{
                    padding: '10px 20px', borderRadius: '50px',
                    border: '2px solid #e0dbd3', background: 'white',
                    color: '#5c5a57', fontSize: '13px', fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                style={{
                  padding: '10px 24px', borderRadius: '50px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #c8601a, #e07030)',
                  color: 'white', fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  boxShadow: '0 4px 12px rgba(200,96,26,0.3)',
                }}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
