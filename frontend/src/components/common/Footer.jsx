import { Link } from 'react-router-dom'
import Button from './Button'

const footerLinks = [
  { name: 'Home', to: '/' },
  { name: 'Features', to: '/features' },
  { name: 'Pricing', to: '/pricing' },
  // { name: 'Dashboard', to: '/dashboard' },
  { name: 'Interview', to: '/interview' },
  { name: 'About', to: '/about' },
]

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-16 px-4 pb-8">
      <div className="section-shell">
        <div className="navy-panel relative overflow-hidden rounded-[32px] px-6 py-10 sm:px-8">
          <div className="ambient-blob left-0 top-0 h-48 w-48 bg-[#c8601a]/25" />
          <div className="ambient-blob bottom-0 right-10 h-56 w-56 bg-white/10" />
          <div className="relative grid gap-8 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
            <div className="space-y-5">
              <div>
                <p className="display-font text-3xl font-bold">HiLearn</p>
                <p className="mt-2 max-w-md text-sm leading-7 text-white/70">
                  Premium AI interview preparation with warm design, focused practice, and feedback that actually helps you improve.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Mock interviews', 'Warm analytics', 'Role-specific feedback'].map((tag) => (
                  <span key={tag} className="rounded-full border border-white/12 bg-white/8 px-3 py-2 text-xs text-white/80">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-6">
                <Button to="/signup" variant="primary" className="px-5 py-3">
                  Start free
                </Button>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/60">Explore</p>
              <div className="mt-4 space-y-3">
                {footerLinks.map((link) => (
                  <Link key={link.to} to={link.to} className="block text-sm text-white/78 transition hover:text-[#f5c96a]">
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/60">Connect</p>
              <div className="mt-4 space-y-3 text-sm text-white/78">
                <p>help@hilearn.ai</p>
                <p>Built for placement season momentum</p>
                {/* <p>Open your route palette with <span className="command-kbd">Ctrl K</span></p> */}
              </div>
            </div>
          </div>
          <div className="relative mt-10 border-t border-white/10 pt-5 text-sm text-white/55">
            © {currentYear} HiLearn. Built for confident interview prep.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
