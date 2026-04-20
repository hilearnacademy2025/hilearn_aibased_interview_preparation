import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const PAGE_TITLES = {
  "/": "Home",
  "/features": "Features",
  "/pricing": "Pricing",
  "/about": "About",
  "/login": "Login",
  "/signup": "Get Started",
};

export default function Navbar({
  pageName,
  showSidebarToggle = false,
  onSidebarToggle,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const currentPageName = pageName || PAGE_TITLES[location.pathname] || "Home";

  const handleMenuClick = () => {
    if (showSidebarToggle && onSidebarToggle) {
      onSidebarToggle();
      return;
    }

    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleMenuClick}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 lg:hidden"
            aria-label="Open navigation"
          >
            {mobileMenuOpen && !showSidebarToggle ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 shadow-lg shadow-blue-500/25">
                <span className="text-sm font-extrabold tracking-[0.2em] text-white">HL</span>
              </div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                HiLearn
              </span>
            </Link>

            <span className="hidden h-8 w-px bg-slate-200 sm:block" />

            <h1 className="text-base font-semibold text-slate-600 sm:text-lg">
              {currentPageName}
            </h1>
          </div>
        </div>

        <nav className="hidden items-center gap-8 lg:flex">
          <Link to="/features" className="text-sm font-semibold text-slate-600 transition hover:text-slate-900">
            Features
          </Link>
          <Link to="/pricing" className="text-sm font-semibold text-slate-600 transition hover:text-slate-900">
            Pricing
          </Link>
          <Link to="/about" className="text-sm font-semibold text-slate-600 transition hover:text-slate-900">
            About
          </Link>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/login"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30"
          >
            Start Free
          </Link>
        </div>
      </div>

      {!showSidebarToggle && mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg lg:hidden">
          <div className="space-y-3">
            <Link
              to="/features"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Features
            </Link>
            <Link
              to="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Pricing
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              About
            </Link>
          </div>

          <div className="mt-4 flex gap-3">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700"
            >
              Login
            </Link>
            <Link
              to="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Start Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
