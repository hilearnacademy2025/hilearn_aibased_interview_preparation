import { Link, useLocation } from "react-router-dom";
import {
  X,
  LayoutDashboard,
  Mic,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

const defaultItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Mic, label: "Mock Interview", href: "/app/interview-setup" },
  { icon: BarChart3, label: "Progress", href: "/app/analytics" },
  { icon: Settings, label: "Settings", href: "/app/settings" },
];

export default function Sidebar({
  open = false,
  onClose,
  items = defaultItems,
  topOffsetClass = "top-20",
  desktopWidthClass = "lg:w-72",
  heightClass = "h-[calc(100vh-5rem)]",
  showBrand = false,
  logoutLabel,
}) {
  const location = useLocation();

  return (
    <>
      {open && (
        <button
          type="button"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/45 lg:hidden"
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`fixed left-0 ${topOffsetClass} ${heightClass} z-50 w-72 transform rounded-r-3xl border-r border-slate-200 bg-white/95 px-4 py-5 shadow-2xl shadow-slate-200/60 backdrop-blur-xl transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 ${desktopWidthClass}`}
      >
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Navigation
          </p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {showBrand && (
          <div className="mb-6 hidden rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:block">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Workspace
            </p>
            <p className="mt-2 text-lg font-bold text-slate-900">HiLearn Console</p>
            <p className="mt-1 text-sm text-slate-500">
              Practice interviews, track progress, and stay consistent.
            </p>
          </div>
        )}

        <nav className="space-y-2">
          {items.map((item, index) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.href ||
              (location.pathname === "/" && item.label === "Dashboard");

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500 group-hover:bg-white"
                  }`}
                >
                  <Icon size={18} />
                </span>
                <span>{item.label}</span>
                {index === 0 && (
                  <span
                    className={`ml-auto rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${
                      isActive ? "bg-white/20 text-white" : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    Live
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 rounded-2xl bg-slate-950 p-5 text-white shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/80">
            AI Coach
          </p>
          <h3 className="mt-2 text-lg font-bold">Stay interview-ready every week</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Build confidence with mock rounds, tailored feedback, and measurable progress.
          </p>
        </div>

        {logoutLabel && (
          <button
            type="button"
            className="mt-6 flex w-full items-center gap-3 rounded-2xl border border-red-100 px-4 py-3.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={18} />
            <span>{logoutLabel}</span>
          </button>
        )}
      </aside>
    </>
  );
}
