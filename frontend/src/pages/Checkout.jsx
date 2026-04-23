
/**
 * Checkout.jsx — Login-style two-column layout
 * Left: plan details + trust signals
 * Right: payment form
 * Modal: centered, smooth animation
 */

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../components/common/Button'
import PageTransition from '../components/common/PageTransition'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

// ── Plan data ─────────────────────────────────────────────────────────────────
const PLAN_INFO = {
  pro: {
    name: 'Pro',
    price: 299,
    displayPrice: '₹299',
    period: '/month',
    tagline: 'Most Popular',
    perks: [
      { icon: '∞', text: 'Unlimited interview flows' },
      { icon: '📊', text: 'Detailed feedback panels' },
      { icon: '🎯', text: 'Dashboard insights' },
      { icon: '⚡', text: 'Priority AI responses' },
    ],
    whyUpgrade: [
      'Practice without limits every day',
      'Pinpoint your weak areas faster',
      'Track improvement over time',
      'Placement season mein aage raho',
    ],
  },
  premium: {
    name: 'Premium',
    price: 799,
    displayPrice: '₹799',
    period: '/month',
    tagline: 'Full Access',
    perks: [
      { icon: '∞', text: 'Unlimited interview flows' },
      { icon: '🏆', text: 'Advanced feedback & coaching' },
      { icon: '🎓', text: 'Extended practice packs' },
      { icon: '🔥', text: 'Priority support' },
    ],
    whyUpgrade: [
      'Everything in Pro, and more',
      'Mentorship-level feedback depth',
      'Structured practice curriculum',
      'Direct support when you need it',
    ],
  },
}

// ── Payment methods ───────────────────────────────────────────────────────────
const PAYMENT_METHODS = [
  {
    id: 'upi',
    label: 'UPI',
    desc: 'PhonePe · Google Pay · Paytm',
    bg: '#6B3FA0',
    icon: (
      <svg viewBox="0 0 44 44" className="h-8 w-8" fill="none">
        <rect width="44" height="44" rx="10" fill="#6B3FA0"/>
        <text x="22" y="29" textAnchor="middle" fontSize="13" fontWeight="800" fill="white" fontFamily="Arial">UPI</text>
      </svg>
    ),
  },
  {
    id: 'card',
    label: 'Credit / Debit Card',
    desc: 'Visa · Mastercard · RuPay',
    bg: '#1A1F71',
    icon: (
      <svg viewBox="0 0 44 44" className="h-8 w-8" fill="none">
        <rect width="44" height="44" rx="10" fill="#1A1F71"/>
        <rect x="6" y="13" width="32" height="7" rx="2" fill="#F7B731"/>
        <rect x="6" y="26" width="12" height="5" rx="1.5" fill="white" opacity="0.75"/>
        <rect x="26" y="26" width="12" height="5" rx="1.5" fill="white" opacity="0.45"/>
      </svg>
    ),
  },
  {
    id: 'netbanking',
    label: 'Net Banking',
    desc: 'SBI · HDFC · ICICI · Axis + more',
    bg: '#00796B',
    icon: (
      <svg viewBox="0 0 44 44" className="h-8 w-8" fill="none">
        <rect width="44" height="44" rx="10" fill="#00796B"/>
        <polygon points="22,7 38,17 6,17" fill="white" opacity="0.9"/>
        <rect x="8" y="20" width="28" height="3" rx="1.5" fill="white"/>
        <rect x="8" y="30" width="6" height="8" rx="1" fill="white" opacity="0.8"/>
        <rect x="19" y="30" width="6" height="8" rx="1" fill="white" opacity="0.8"/>
        <rect x="30" y="30" width="6" height="8" rx="1" fill="white" opacity="0.8"/>
      </svg>
    ),
  },
  {
    id: 'wallet',
    label: 'Wallets',
    desc: 'Paytm · Amazon Pay · Mobikwik',
    bg: '#0070BA',
    icon: (
      <svg viewBox="0 0 44 44" className="h-8 w-8" fill="none">
        <rect width="44" height="44" rx="10" fill="#0070BA"/>
        <rect x="6" y="13" width="32" height="20" rx="4" stroke="white" strokeWidth="2" fill="none"/>
        <rect x="28" y="20" width="10" height="6" rx="3" fill="#F7B731"/>
      </svg>
    ),
  },
]

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-sdk')) { resolve(true); return }
    const s = document.createElement('script')
    s.id = 'razorpay-sdk'
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => resolve(true)
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })
}

export default function CheckoutPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()

  const planKey = searchParams.get('plan')?.toLowerCase() || 'pro'
  const plan = PLAN_INFO[planKey]

  const [step, setStep] = useState('confirm')  // confirm | processing | success | error
  const [errorMsg, setErrorMsg] = useState('')
  const [paymentId, setPaymentId] = useState('')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    document.title = `Checkout — ${plan?.name || 'Plan'} | HiLearn`
    if (!plan) navigate('/pricing', { replace: true })
    if (!isAuthenticated) navigate(`/login?redirect=${encodeURIComponent(`/checkout?plan=${planKey}`)}`, { replace: true })
  }, [plan, planKey, isAuthenticated, navigate])

  if (!plan || !isAuthenticated) return null

  async function handlePayment() {
    setShowModal(false)
    setStep('processing')
    setErrorMsg('')
    try {
      const loaded = await loadRazorpayScript()
      if (!loaded) throw new Error('Payment SDK load nahi hua. Internet check karo.')
      const { data: order } = await api.post('/payment/create-order', { plan: planKey })
      await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: order.key_id,
          amount: order.amount,
          currency: order.currency,
          name: 'HiLearn',
          description: `${order.plan_name} Plan — Monthly`,
          order_id: order.order_id,
          prefill: { name: user?.name || '', email: user?.email || '' },
          theme: { color: '#c8601a' },
          modal: { ondismiss: () => { setStep('confirm'); resolve(null) } },
          handler: async (response) => {
            try {
              const { data: verify } = await api.post('/payment/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan: planKey,
              })
              if (verify.success) { setPaymentId(response.razorpay_payment_id); setStep('success') }
              else throw new Error('Verification failed.')
              resolve(verify)
            } catch (err) { reject(err) }
          },
        })
        rzp.on('payment.failed', (r) => reject(new Error(r.error?.description || 'Payment failed.')))
        rzp.open()
      })
    } catch (err) {
      setErrorMsg(err?.message || 'Kuch galat ho gaya. Dobara try karo.')
      setStep('error')
    }
  }

  // ── LEFT PANEL (always visible) ───────────────────────────────────────────
  const LeftPanel = () => (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      className="navy-panel relative overflow-hidden rounded-[32px] p-8 flex flex-col justify-between"
    >
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="ambient-blob -left-8 -top-8 h-52 w-52 bg-[#c8601a]/30"
      />
      <div className="relative">
        <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/70">
          {plan.tagline}
        </span>
        <h1 className="display-font mt-4 text-5xl font-bold text-white leading-tight">
          {plan.name} Plan
        </h1>
        <p className="mt-2 text-white/60 text-base">
          Ek payment, unlimited growth.
        </p>

        {/* Price display */}
        <div className="mt-6 flex items-end gap-1">
          <span className="display-font text-6xl font-bold text-white">{plan.displayPrice}</span>
          <span className="mb-2 text-white/50 text-sm">{plan.period}</span>
        </div>

        {/* Perks */}
        <div className="mt-7 space-y-3">
          {plan.perks.map((perk, i) => (
            <motion.div
              key={perk.text}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}
              className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white/80"
            >
              <span className="text-base">{perk.icon}</span>
              {perk.text}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trust badges */}
      <div className="relative mt-8 flex flex-wrap gap-2">
        {['🔒 SSL Secured', '✓ Cancel anytime', '🇮🇳 Razorpay'].map((badge) => (
          <span key={badge} className="rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-xs text-white/55">
            {badge}
          </span>
        ))}
      </div>
    </motion.div>
  )

  return (
    <PageTransition>
      <section className="section-shell min-h-[80vh] flex items-center py-12">
        <div className="w-full grid gap-8 lg:grid-cols-[1fr_1fr] items-stretch">

          {/* LEFT */}
          <LeftPanel />

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            className="surface-card px-7 py-8 flex flex-col justify-center"
          >

            {/* ── CONFIRM ───────────────────────────────────────── */}
            {step === 'confirm' && (
              <>
                <div className="mb-7">
                  <p className="text-sm uppercase tracking-[0.22em] text-[#c8601a]">Secure Checkout</p>
                  <h2 className="display-font mt-2 text-3xl font-bold text-[#0f1f3d]">Complete your order</h2>
                  <p className="mt-1 text-sm text-[#9c9a96]">Choose a payment method to activate your plan instantly.</p>
                </div>

                {/* Paying as */}
                <div className="mb-5 flex items-center gap-3 rounded-2xl border border-[#e0dbd3] bg-[#fffaf4] px-4 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c8601a]/10 text-sm font-bold text-[#c8601a]">
                    {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#9c9a96]">Paying as</p>
                    <p className="truncate text-sm font-semibold text-[#0f1f3d]">{user?.email}</p>
                  </div>
                </div>

                {/* Order total */}
                <div className="mb-6 rounded-2xl border border-[#e0dbd3] bg-white px-5 py-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#5c5a57]">{plan.name} Plan — 1 month</span>
                    <span className="font-bold text-[#0f1f3d]">{plan.displayPrice}</span>
                  </div>
                  <div className="mt-2 border-t border-[#f0ebe3] pt-2 flex items-center justify-between">
                    <span className="text-xs text-[#9c9a96]">Total (incl. GST)</span>
                    <span className="text-lg font-bold text-[#c8601a]">{plan.displayPrice}</span>
                  </div>
                </div>

                {/* Pay button */}
                <motion.button
                  whileHover={{ scale: 1.025 }}
                  whileTap={{ scale: 0.975 }}
                  onClick={() => setShowModal(true)}
                  className="w-full rounded-full bg-[#c8601a] py-4 text-base font-semibold text-white shadow-[0_16px_28px_rgba(200,96,26,0.28)] hover:bg-[#ae5317] transition"
                >
                  Pay {plan.displayPrice} securely →
                </motion.button>

                <p className="mt-3 text-center text-xs text-[#9c9a96]">
                  🔒 256-bit SSL encryption · Powered by Razorpay
                </p>

                <Button to="/pricing" variant="ghost" className="mt-3 w-full justify-center text-sm">
                  ← Back to Pricing
                </Button>

                {/* Why upgrade */}
                <div className="mt-6 rounded-2xl border border-[#e0dbd3] bg-[#fffaf4] p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#c8601a]">Why students choose {plan.name}</p>
                  <div className="space-y-2">
                    {plan.whyUpgrade.map((w) => (
                      <div key={w} className="flex items-start gap-2 text-xs text-[#5c5a57]">
                        <span className="mt-0.5 text-[#c8601a]">✓</span>
                        {w}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── PROCESSING ────────────────────────────────────── */}
            {step === 'processing' && (
              <div className="flex flex-col items-center gap-5 py-16 text-center">
                <span className="h-14 w-14 animate-spin rounded-full border-2 border-[#c8601a]/20 border-t-[#c8601a]" />
                <div>
                  <p className="text-lg font-semibold text-[#0f1f3d]">Processing your payment…</p>
                  <p className="mt-1 text-sm text-[#9c9a96]">Razorpay window band mat karo</p>
                </div>
              </div>
            )}

            {/* ── SUCCESS ───────────────────────────────────────── */}
            {step === 'success' && (
              <div className="flex flex-col items-center gap-5 py-8 text-center">
                <motion.div
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-[#c8601a]/10 text-5xl"
                >
                  🎉
                </motion.div>
                <div>
                  <h2 className="display-font text-2xl font-bold text-[#0f1f3d]">Payment Successful!</h2>
                  <p className="mt-2 text-[#5c5a57]">
                    Welcome to <span className="font-semibold text-[#c8601a]">{plan.name}</span> plan!
                    <br />Aapka subscription abhi active hai.
                  </p>
                </div>
                {paymentId && (
                  <p className="rounded-xl bg-[#f4f2ee] px-4 py-2 text-xs text-[#9c9a96]">
                    Payment ID: {paymentId}
                  </p>
                )}
                <Button to="/user" className="mt-1 w-full justify-center">Go to Dashboard →</Button>
              </div>
            )}

            {/* ── ERROR ─────────────────────────────────────────── */}
            {step === 'error' && (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-3xl text-rose-400">✕</div>
                <div>
                  <h2 className="display-font text-2xl font-bold text-[#0f1f3d]">Payment Failed</h2>
                  <p className="mt-2 text-sm text-[#5c5a57]">{errorMsg}</p>
                </div>
                <Button onClick={() => setStep('confirm')} className="w-full justify-center">Try Again</Button>
                <Button to="/pricing" variant="ghost" className="w-full justify-center text-sm">← Back to Pricing</Button>
              </div>
            )}

          </motion.div>
        </div>
      </section>

      {/* ── PAYMENT METHOD MODAL — screen center mein ────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />

            {/* Modal — center se scale karke aata hai */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                key="modal"
                initial={{ opacity: 0, scale: 0.88, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.88, y: 20 }}
                transition={{ type: 'spring', stiffness: 340, damping: 28 }}
                className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-[0_32px_80px_rgba(0,0,0,0.22)]"
              >
                {/* Modal header */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-[#c8601a]">Secure Payment</p>
                    <p className="mt-1 text-xl font-bold text-[#0f1f3d]">Choose payment method</p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f4f2ee] text-[#5c5a57] hover:bg-[#e0dbd3] transition text-sm font-semibold"
                  >
                    ✕
                  </button>
                </div>

                {/* Amount pill */}
                <div className="mb-4 flex items-center justify-between rounded-2xl border border-[#e0dbd3] bg-[#fffaf4] px-4 py-3">
                  <span className="text-sm text-[#5c5a57]">{plan.name} Plan · Monthly</span>
                  <span className="text-base font-bold text-[#c8601a]">{plan.displayPrice}</span>
                </div>

                {/* Methods */}
                <div className="space-y-2">
                  {PAYMENT_METHODS.map((method) => (
                    <motion.button
                      key={method.id}
                      whileHover={{ scale: 1.015, x: 3 }}
                      whileTap={{ scale: 0.985 }}
                      onClick={handlePayment}
                      className="flex w-full items-center gap-4 rounded-2xl border border-[#e0dbd3] bg-white px-4 py-3.5 text-left hover:border-[#c8601a]/50 hover:bg-[#fffaf4] transition group"
                    >
                      <span className="flex-shrink-0 rounded-xl">{method.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#0f1f3d]">{method.label}</p>
                        <p className="text-xs text-[#9c9a96]">{method.desc}</p>
                      </div>
                      <motion.span
                        initial={{ opacity: 0, x: -4 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        className="text-[#c8601a] text-sm font-semibold opacity-0 group-hover:opacity-100 transition"
                      >
                        →
                      </motion.span>
                    </motion.button>
                  ))}
                </div>

                <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-[#9c9a96]">
                  <span>🔒</span>
                  <span>256-bit SSL · Powered by Razorpay · Cancel anytime</span>
                </p>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}