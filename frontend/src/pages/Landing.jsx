import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Mic, BookOpen, Users, TrendingUp, BarChart3, Check, Play } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  useEffect(() => {
    document.title = "HiLearn | AI-Powered Mock Interviews for Indian Students";
  }, []);

  const companies = [
    { name: "TCS", emoji: "🏢" },
    { name: "Infosys", emoji: "💼" },
    { name: "Wipro", emoji: "🔷" },
    { name: "Zomato", emoji: "🍕" },
    { name: "Razorpay", emoji: "💳" },
    { name: "Flipkart", emoji: "📦" },
    { name: "Amazon", emoji: "🛍️" },
    { name: "Google", emoji: "🔍" },
  ];

  const socialProof = [
    { label: "Interviews Completed", value: "2,400+", icon: "🎤" },
    { label: "Average Rating", value: "4.8★", icon: "⭐" },
    { label: "Got Shortlisted", value: "94%", icon: "✅" },
  ];

  const features = [
    { icon: Sparkles, title: "AI Mock Interviews", desc: "Real-time, conversational AI asking dynamic questions based on your role & experience" },
    { icon: Mic, title: "Voice Analysis", desc: "Track confidence, filler words (um, uh), speaking speed, and intonation patterns" },
    { icon: BookOpen, title: "India-Specific Questions", desc: "Questions tailored to Indian job market, startups, and skill requirements" },
    { icon: Users, title: "Peer Interviews", desc: "Practice with fellow students in real-time, schedule mock interview sessions" },
    { icon: TrendingUp, title: "Smart Feedback", desc: "AI-generated feedback with actionable suggestions to improve your answers" },
    { icon: BarChart3, title: "Analytics Dashboard", desc: "Track performance trends, identify weak areas, and measure improvement over time" },
  ];

  const testimonials = [
    { name: "Aisha Kumar", role: "Fresher, IIT Delhi", text: "HiLearn helped me crack interviews at Google and Amazon. The AI's feedback was spot-on!", avatar: "AK" },
    { name: "Rohan Patel", role: "Mid-level Engineer", text: "Finally, affordable practice without hiring expensive coaches. ₹299 is a steal!", avatar: "RP" },
    { name: "Priya Singh", role: "Product Manager", text: "The peer interview feature helped me prepare better. Real conversations > AI alone.", avatar: "PS" },
  ];

  const pricingPlans = [
    { name: "Free", price: "₹0", desc: "Get started", interviews: "3 interviews/month", features: ["Mock interviews (tech + HR)", "Basic feedback", "No voice analysis"] },
    { name: "Pro", price: "₹299", desc: "Most popular", interviews: "20 interviews/month", features: ["All Free features", "Voice analysis", "Advanced feedback", "Peer interviews"], popular: true },
    { name: "Premium", price: "₹999", desc: "For serious prep", interviews: "Unlimited interviews", features: ["All Pro features", "1-on-1 mentoring", "Custom questions", "Priority support"] },
  ];

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
        </div>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-6 py-2.5 text-blue-600 text-sm font-semibold mb-8"
            >
              <Sparkles size={18} />
              🚀 AI-Powered Interview Prep for India
            </motion.div>
            <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Ace Your Dream Job with <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">AI-Powered</span> Interviews
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-10 leading-relaxed">
              Real-time mock interviews, voice analysis, and India-focused questions. Get feedback instantly. Join 10,000+ students from IITs and tech startups.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/signup" className="btn-primary flex items-center justify-center gap-2 group inline-block bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all">
                Start Free Trial <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="btn-secondary flex items-center justify-center gap-2 inline-block border border-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all">
                <Play size={18} />
                Watch Demo (2 min)
              </button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-video bg-gradient-to-br from-blue-50 to-gray-50 rounded-3xl border-2 border-gray-200 shadow-2xl flex items-center justify-center overflow-hidden">
              <div className="text-center">
                <div className="text-8xl mb-6 animate-bounce-slow">🤖</div>
                <p className="text-xl text-gray-600 font-semibold">AI Interview Interface</p>
                <p className="text-gray-500">Real-time conversational AI powered by Groq</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Logo Ticker */}
      <section className="py-16 bg-gradient-to-r from-gray-50 via-blue-50 to-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-gray-600 font-semibold mb-8 text-sm uppercase tracking-widest">Trusted by students from leading companies</p>
          <div className="overflow-hidden">
            <motion.div
              animate={{ x: ["0%", "-100%"] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="flex gap-12 whitespace-nowrap"
            >
              {[...companies, ...companies].map((company, idx) => (
                <div key={idx} className="flex items-center gap-3 px-8">
                  <span className="text-3xl">{company.emoji}</span>
                  <span className="text-lg font-bold text-gray-700">{company.name}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-gradient-to-r from-blue-700 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {socialProof.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl mb-4">{stat.icon}</div>
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <p className="text-blue-100 text-lg">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose HiLearn?</h2>
            <p className="text-xl text-gray-600">Everything you need to ace your next interview</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="bg-white border-2 border-blue-100 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">4 simple steps to prepare like a pro</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { num: "1", title: "Setup", desc: "Select role & interview type", emoji: "⚙️" },
              { num: "2", title: "Interview", desc: "Answer AI's questions", emoji: "🤖" },
              { num: "3", title: "Feedback", desc: "Get AI analysis & scores", emoji: "📊" },
              { num: "4", title: "Improve", desc: "Track progress over time", emoji: "📈" },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative text-center"
              >
                <div className="relative z-10 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-400 text-white rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-4 shadow-lg">
                    {step.emoji}
                  </div>
                  <div className="text-sm font-bold text-blue-600 uppercase tracking-wider">Step {step.num}</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Students Love HiLearn</h2>
            <p className="text-xl text-gray-600">Real stories from real students</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white border-2 border-blue-100 rounded-2xl p-8 shadow-md"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400 text-lg">★</span>)}
                </div>
                <p className="text-gray-700 italic mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Choose the perfect plan for your goals</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
            {pricingPlans.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`bg-white rounded-2xl relative transition-all ${
                  plan.popular
                    ? "md:scale-105 border-2 border-blue-600 shadow-2xl"
                    : "border-2 border-blue-100 shadow-md"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="inline-block bg-gradient-to-r from-blue-600 to-blue-400 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                      Most Popular ⭐
                    </span>
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.desc}</p>
                  <div className="mb-8">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-3">/month</span>
                  </div>
                  <div className="bg-blue-50 rounded-full px-4 py-2 text-center text-sm font-semibold text-blue-600 mb-8 inline-block">
                    {plan.interviews}
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-start gap-3 text-gray-700">
                        <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${
                    plan.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "border border-blue-600 text-blue-600 hover:bg-blue-50"
                  }`}>
                    Get Started
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-gradient-to-r from-blue-800 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto px-4 text-center"
        >
          <h2 className="text-5xl sm:text-6xl font-bold text-white mb-8 leading-tight">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl text-blue-100 mb-12 leading-relaxed">
            Join 10,000+ students practicing with HiLearn today. Start your free trial — no credit card required. Cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2 group">
              Start Free Trial <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="border border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all">
              Schedule a Demo
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}