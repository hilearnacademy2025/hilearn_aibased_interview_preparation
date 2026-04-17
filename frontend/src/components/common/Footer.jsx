

import { Link } from 'react-router-dom'

function Footer() {
  const currentYear = new Date().getFullYear()

  const links = [
    { name: 'Home', to: '/' },
    { name: 'Dashboard', to: '/dashboard' },
    { name: 'Interview Lab', to: '/interview' },
    { name: 'Pricing', to: '/pricing' },
  ]

  return (
    <footer className="border-t border-gray-800 bg-black py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Main Footer Content */}
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr_auto] lg:gap-12">
          
          {/* Left Section - Brand */}
          <div className="space-y-5">
            <div className="inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 font-bold text-white shadow-md shadow-blue-500/30">
                H
              </span>
              <div>
                <p className="text-base font-bold text-white">HiLearn AI</p>
                <p className="text-xs text-white">Interview Prep Platform</p>
              </div>
            </div>
            
            <p className="max-w-md text-sm leading-7 text-white">
              A calm, modern practice space for Indian students preparing for placement rounds, 
              internships, and first-job interviews.
            </p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {['Mock interviews', 'Feedback insights', 'Learning-first UI'].map((tag, idx) => (
                <span
                  key={idx}
                  className="rounded-full border border-gray-700 bg-gray-900/50 px-3 py-1.5 text-xs font-medium transition-colors duration-200 cursor-pointer"
                  style={{ color: 'white' }}
                  onMouseEnter={(e) => e.target.style.color = '#3B82F6'}
                  onMouseLeave={(e) => e.target.style.color = 'white'}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Middle Section - Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="text-sm transition-colors duration-200"
                    style={{ color: 'white' }}
                    onMouseEnter={(e) => e.target.style.color = '#3B82F6'}
                    onMouseLeave={(e) => e.target.style.color = 'white'}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Section - Social / Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Connect
            </h3>
            <div className="space-y-3">
              <a 
                href="#" 
                className="flex items-center gap-2 text-sm transition-colors duration-200"
                style={{ color: 'white' }}
                onMouseEnter={(e) => e.target.style.color = '#3B82F6'}
                onMouseLeave={(e) => e.target.style.color = 'white'}
              >
                <span className="text-base">📧</span> help@hilearn.ai
              </a>
              <a 
                href="#" 
                className="flex items-center gap-2 text-sm transition-colors duration-200"
                style={{ color: 'white' }}
                onMouseEnter={(e) => e.target.style.color = '#3B82F6'}
                onMouseLeave={(e) => e.target.style.color = 'white'}
              >
                <span className="text-base">🐦</span> Twitter
              </a>
              <a 
                href="#" 
                className="flex items-center gap-2 text-sm transition-colors duration-200"
                style={{ color: 'white' }}
                onMouseEnter={(e) => e.target.style.color = '#3B82F6'}
                onMouseLeave={(e) => e.target.style.color = 'white'}
              >
                <span className="text-base">💼</span> LinkedIn
              </a>
              <a 
                href="#" 
                className="flex items-center gap-2 text-sm transition-colors duration-200"
                style={{ color: 'white' }}
                onMouseEnter={(e) => e.target.style.color = '#3B82F6'}
                onMouseLeave={(e) => e.target.style.color = 'white'}
              >
                <span className="text-base">📱</span> Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Copyright */}
        <div className="mt-10 pt-6 border-t border-gray-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white">
            © {currentYear} HiLearn AI. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a 
              href="#" 
              className="text-xs transition-colors duration-200"
              style={{ color: 'white' }}
              onMouseEnter={(e) => e.target.style.color = '#3B82F6'}
              onMouseLeave={(e) => e.target.style.color = 'white'}
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="text-xs transition-colors duration-200"
              style={{ color: 'white' }}
              onMouseEnter={(e) => e.target.style.color = '#3B82F6'}
              onMouseLeave={(e) => e.target.style.color = 'white'}
            >
              Terms of Service
            </a>
            <a 
              href="#" 
              className="text-xs transition-colors duration-200"
              style={{ color: 'white' }}
              onMouseEnter={(e) => e.target.style.color = '#3B82F6'}
              onMouseLeave={(e) => e.target.style.color = 'white'}
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer