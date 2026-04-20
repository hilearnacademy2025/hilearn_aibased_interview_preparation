import { ArrowRight, Play, Sparkles, Check, BarChart3 } from "lucide-react";

export default function Hero() {
  const highlights = [
    "AI-led mock interviews tailored to your role",
    "Instant answer feedback and speaking analysis",
    "Progress tracking built for job-ready consistency",
  ];

  const proofItems = [
    { label: "Practice Sessions", value: "12k+" },
    { label: "Interview Playbooks", value: "250+" },
    { label: "Success Rate Lift", value: "38%" },
  ];

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-12 shadow-lg sm:px-10 lg:px-14 lg:py-16">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50" />

      <div className="relative grid items-center gap-10 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            <Sparkles size={16} />
            AI-powered interview preparation for students and professionals
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl xl:text-6xl">
            Crack Your Dream Job with AI
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            HiLearn simulates real interviews, analyzes your answers, and shows exactly
            where to improve so you can walk into every round prepared and confident.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:-translate-y-0.5 hover:shadow-xl">
              Start Free
              <ArrowRight size={18} />
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-base font-semibold text-slate-700 transition hover:bg-slate-50">
              <Play size={18} />
              Watch Demo
            </button>
          </div>

          <ul className="mt-10 grid gap-3 text-sm font-medium text-slate-600 sm:grid-cols-2">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                <Check size={18} className="mt-0.5 text-emerald-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[2rem] bg-slate-950 p-5 text-white shadow-2xl shadow-slate-300/50">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-cyan-200">Live Mock Interview</p>
                <h3 className="mt-1 text-2xl font-bold">Frontend Developer</h3>
              </div>
              <div className="rounded-2xl bg-emerald-400/15 px-3 py-2 text-sm font-semibold text-emerald-300">
                Session Active
              </div>
            </div>

            <div className="mt-6 rounded-3xl bg-white p-5 text-slate-900 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">AI Feedback Score</p>
                  <p className="mt-2 text-4xl font-extrabold">92%</p>
                </div>
                <div className="rounded-3xl bg-blue-50 p-4 text-blue-600">
                  <BarChart3 size={28} />
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                {proofItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <span className="text-sm font-medium text-slate-500">{item.label}</span>
                    <span className="text-lg font-bold text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
