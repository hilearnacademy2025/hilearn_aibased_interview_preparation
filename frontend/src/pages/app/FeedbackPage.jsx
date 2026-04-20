import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Zap, Volume2, Gauge, BarChart3, CheckCircle, AlertCircle, Download, Share2 } from "lucide-react";

export default function FeedbackPage() {
  const [selectedTab, setSelectedTab] = useState("overview");

  const score = 82;
  const maxScore = 100;

  const feedbackAreas = [
    { icon: Gauge, label: "Confidence", score: 85, feedback: "Excellent! You answered with conviction." },
    { icon: Volume2, label: "Communication", score: 78, feedback: "Clear delivery. Work on reducing filler words." },
    { icon: Zap, label: "Technical Knowledge", score: 88, feedback: "Strong fundamentals. Great system design thinking." },
    { icon: BarChart3, label: "Problem Solving", score: 80, feedback: "Good approach. Could optimize the solution." },
  ];

  const voiceAnalysis = [
    { metric: "Speaking Speed", value: "140 words/min", status: "Optimal", benchmark: "120-150 words/min" },
    { metric: "Filler Words", value: "8 times", status: "Good", benchmark: "< 10 times" },
    { metric: "Pauses", value: "4.2 sec avg", status: "Good", benchmark: "2-5 sec" },
    { metric: "Confidence Score", value: "91%", status: "Excellent", benchmark: "80%+ is great" },
  ];

  const strengths = [
    "Clear understanding of system architecture",
    "Good problem decomposition skills",
    "Confident and articulate communication",
    "Mentioned relevant trade-offs and trade-offs"
  ];

  const improvements = [
    "Reduce filler words (um, uh, like) - practice pacing",
    "Go deeper into database optimization",
    "Ask clarifying questions earlier",
    "Practice white-boarding skills",
  ];

  const suggestions = [
    "System Design Patterns course (Advanced)",
    "Behavioral Interview Bootcamp",
    "Mock with peer on same topic"
  ];

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Feedback</h1>
        <p className="text-gray-600">Backend Engineer • Technical Round • Today</p>
      </motion.div>

      {/* Score Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-8 mb-8 flex items-center justify-between"
      >
        <div>
          <p className="text-gray-600 font-medium mb-2">Overall Performance</p>
          <h2 className="text-5xl font-bold text-gray-900">{score}%</h2>
          <p className="text-gray-600 mt-2">Great job! You're on track for top companies.</p>
        </div>

        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="8" />
            <motion.circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#22c55e"
              strokeWidth="8"
              strokeLinecap="round"
              initial={{ strokeDashoffset: 314 }}
              animate={{ strokeDashoffset: 314 - (314 * score) / 100 }}
              transition={{ duration: 1.5 }}
              style={{ strokeDasharray: 314 }}
            />
          </svg>
          <span className="absolute text-3xl font-bold text-gray-900">{score}</span>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-200">
        {[
          { id: "overview", label: "Overview" },
          { id: "voice", label: "Voice Analysis" },
          { id: "detailed", label: "Detailed Feedback" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`px-4 py-3 font-semibold border-b-2 transition-all ${
              selectedTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {selectedTab === "overview" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {/* Feedback Areas */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {feedbackAreas.map((area, idx) => {
                const Icon = area.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-xl border border-gray-200 p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="font-bold text-gray-900">{area.label}</h3>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-2xl font-bold text-gray-900">{area.score}%</span>
                        <span className={`text-sm font-semibold ${area.score >= 80 ? "text-green-600" : "text-yellow-600"}`}>
                          {area.score >= 80 ? "Great" : "Good"}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600" style={{ width: `${area.score}%` }}></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{area.feedback}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Strengths */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-green-50 border border-green-200 rounded-xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="font-bold text-gray-900">Strengths</h3>
              </div>
              <ul className="space-y-3">
                {strengths.map((strength, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Areas for Improvement */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-orange-50 border border-orange-200 rounded-xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-6 h-6 text-orange-600" />
                <h3 className="font-bold text-gray-900">Areas to Improve</h3>
              </div>
              <ul className="space-y-3">
                {improvements.map((improvement, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <span className="text-orange-600 font-bold mt-1">•</span>
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-4">📚 Recommended Next Steps</h3>
            <div className="space-y-3">
              {suggestions.map((suggestion, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-100">
                  <p className="text-gray-700">{suggestion}</p>
                  <button className="text-blue-600 font-semibold hover:underline">View</button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Voice Analysis Tab */}
      {selectedTab === "voice" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {voiceAnalysis.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <p className="text-gray-600 text-sm mb-2">{item.metric}</p>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-3xl font-bold text-gray-900">{item.value}</p>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    item.status === "Excellent" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-gray-600">Benchmark: {item.benchmark}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Detailed Feedback Tab */}
      {selectedTab === "detailed" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl border border-gray-200 p-8"
        >
          <div className="prose max-w-none">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Detailed Analysis</h3>
            <div className="space-y-4 text-gray-700">
              <p>
                Your technical foundations are strong. You demonstrated good system design thinking and were able to break down the problem effectively.
              </p>
              <p>
                However, there are a few areas where you can improve:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>When discussing database choices, it would be helpful to quantify trade-offs (e.g., latency, throughput)</li>
                <li>Ask clarifying questions earlier in the process to narrow down the problem scope</li>
                <li>Practice reducing filler words - you used "um" and "like" approximately 8 times during the interview</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 flex gap-4 flex-wrap"
      >
        <Link
          to="/app/interview-setup"
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          <Zap size={18} />
          Take Another Interview
        </Link>
        <button className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-semibold hover:bg-gray-50 transition-colors">
          <Download size={18} />
          Download Report
        </button>
        <button className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-semibold hover:bg-gray-50 transition-colors">
          <Share2 size={18} />
          Share Feedback
        </button>
      </motion.div>
    </div>
  );
}
