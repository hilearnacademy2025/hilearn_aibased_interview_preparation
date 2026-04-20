import { motion } from "framer-motion";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function Analytics() {
  const performanceData = [
    { week: "Week 1", score: 65, interviews: 4 },
    { week: "Week 2", score: 72, interviews: 5 },
    { week: "Week 3", score: 78, interviews: 6 },
    { week: "Week 4", score: 80, interviews: 7 },
  ];

  const skillBreakdown = [
    { name: "Technical", value: 82, color: "#3b82f6" },
    { name: "Communication", value: 78, color: "#8b5cf6" },
    { name: "Problem Solving", value: 80, color: "#ec4899" },
    { name: "Confidence", value: 85, color: "#f59e0b" },
  ];

  const interviewTypeStats = [
    { type: "Technical", count: 7, avgScore: 82 },
    { type: "HR", count: 3, avgScore: 78 },
    { type: "Behavioral", count: 2, avgScore: 80 },
  ];

  const improvementAreas = [
    { skill: "System Design", current: 80, target: 95, progress: 75 },
    { skill: "Communication", current: 78, target: 90, progress: 65 },
    { skill: "Coding Speed", current: 72, target: 88, progress: 50 },
    { skill: "DSA", current: 85, target: 95, progress: 85 },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Progress</h1>
        <p className="text-gray-600">Track your interview prep journey with detailed analytics</p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Interviews", value: "18", change: "+2 this week" },
          { label: "Average Score", value: "80%", change: "+5% from start" },
          { label: "Best Score", value: "88%", change: "Technical Round" },
          { label: "Current Streak", value: "5 days", change: "Keep going! 🔥" },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <p className="text-gray-600 text-sm font-medium mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-xs text-gray-600">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Performance Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <h2 className="text-lg font-bold text-gray-900 mb-6">Performance Trend (4 Weeks)</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="week" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
              cursor={{ fill: "rgba(37, 99, 235, 0.1)" }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#2563eb" 
              strokeWidth={2}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Skill Breakdown & Interview Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Skill Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-6">Skill Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={skillBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {skillBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Interview Type Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-6">Interview Type Stats</h2>
          <div className="space-y-6">
            {interviewTypeStats.map((stat, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900">{stat.type}</p>
                  <p className="text-sm text-gray-600">{stat.count} interviews • Avg: {stat.avgScore}%</p>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600"
                    style={{ width: `${stat.avgScore}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Improvement Areas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <h2 className="text-lg font-bold text-gray-900 mb-6">Improvement Roadmap</h2>
        <div className="space-y-6">
          {improvementAreas.map((area, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{area.skill}</p>
                  <p className="text-xs text-gray-600">Current: {area.current}% → Target: {area.target}%</p>
                </div>
                <p className="text-sm font-bold text-blue-600">{area.progress}%</p>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                  style={{ width: `${area.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
