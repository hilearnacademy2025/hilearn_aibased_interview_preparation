import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BarChart3, TrendingUp, Zap, Award, ArrowUpRight, Menu, X, Home, BookOpen, Users, Settings, LogOut, Plus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useState } from "react";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigationItems = [
    { icon: Home, label: "Dashboard", path: "/app/dashboard", active: true },
    { icon: BookOpen, label: "My Interviews", path: "/app/interviews" },
    { icon: TrendingUp, label: "Progress", path: "/app/progress" },
    { icon: Users, label: "Peer Practice", path: "/app/peer-practice" },
    { icon: Settings, label: "Settings", path: "/app/settings" },
  ];

  const stats = [
    { icon: Zap, label: "Total Interviews", value: "12", trend: "+3", trendLabel: "this month", color: "bg-blue-50 text-blue-600" },
    { icon: TrendingUp, label: "Avg Score", value: "78%", trend: "+5%", trendLabel: "last month", color: "bg-green-50 text-green-600" },
    { icon: Award, label: "Best Score", value: "92%", trend: "Tech", trendLabel: "interview", color: "bg-purple-50 text-purple-600" },
    { icon: BarChart3, label: "Current Streak", value: "5 days", trend: "Active", trendLabel: "🔥", color: "bg-orange-50 text-orange-600" },
  ];

  const performanceData = [
    { date: "Mon", score: 65 },
    { date: "Tue", score: 72 },
    { date: "Wed", score: 68 },
    { date: "Thu", score: 80 },
    { date: "Fri", score: 78 },
    { date: "Sat", score: 82 },
    { date: "Sun", score: 85 },
  ];

  const recentInterviews = [
    { type: "Technical", role: "Backend Engineer", score: 85, date: "Today", status: "Completed" },
    { type: "HR Round", role: "Frontend Developer", score: 78, date: "Yesterday", status: "Completed" },
    { type: "Behavioral", role: "Product Manager", score: 82, date: "2 days ago", status: "Completed" },
    { type: "System Design", role: "Senior Backend", score: 72, date: "3 days ago", status: "Completed" },
  ];

  const recommendedLearning = [
    { title: "System Design Mastery", level: "Advanced", progress: 60 },
    { title: "Behavioral Interview Tips", level: "Beginner", progress: 30 },
    { title: "Data Structures Deep Dive", level: "Intermediate", progress: 45 },
  ];

  const getScoreBadgeColor = (score) => {
    if (score >= 80) return "badge-success";
    if (score >= 60) return "badge-warning";
    return "badge-error";
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.div
        animate={{ width: sidebarOpen ? 256 : 80 }}
        transition={{ duration: 0.3 }}
        className="bg-white border-r border-gray-200 flex flex-col hidden md:flex"
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen && <span className="font-bold text-lg text-blue-600">HiLearn</span>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                  item.active
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button className="w-full flex items-center gap-4 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10">
          <span className="font-bold text-lg text-blue-600">HiLearn</span>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {getGreeting()}, Hanee 👋
            </h1>
            <p className="text-gray-600">
              Keep your 5-day streak alive! You have 8 interviews left this month.
            </p>
          </motion.div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="card-primary card-hover"
                >
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon size={24} />
                  </div>
                  <p className="text-gray-600 text-sm font-medium mb-2">{stat.label}</p>
                  <div className="flex items-end justify-between">
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <div className="text-green-600 text-xs font-semibold flex items-center gap-1">
                      <ArrowUpRight size={14} />
                      {stat.trend}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{stat.trendLabel}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Chart and CTA */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Performance Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 card-primary"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-6">Performance This Week</h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "12px" }}
                    cursor={{ fill: "rgba(37, 99, 235, 0.1)" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorScore)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Start Interview CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-xl p-6 flex flex-col justify-between card-hover"
            >
              <div>
                <h3 className="text-lg font-bold mb-2">Ready to Practice?</h3>
                <p className="text-blue-100 text-sm mb-6">
                  You've completed 12 interviews. Keep the momentum going!
                </p>
              </div>
              <Link
                to="/app/interview-setup"
                className="btn-primary w-full text-center inline-block"
              >
                Start Interview 🚀
              </Link>
            </motion.div>
          </div>

          {/* Recent Interviews & Learning */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Interviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card-primary"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Interviews</h2>
              <div className="space-y-3">
                {recentInterviews.map((interview, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{interview.type}</p>
                      <p className="text-sm text-gray-600">{interview.role}</p>
                      <p className="text-xs text-gray-500 mt-1">{interview.date}</p>
                    </div>
                    <div className="text-right">
                      <p className={`badge ${getScoreBadgeColor(interview.score)} font-bold py-1 px-3 rounded-full text-sm`}>
                        {interview.score}%
                      </p>
                      <p className="text-xs text-gray-500 mt-2">{interview.status}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recommended Learning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card-primary"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-6">Recommended Learning</h2>
              <div className="space-y-6">
                {recommendedLearning.map((course, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{course.title}</p>
                        <p className="text-xs text-gray-600">{course.level}</p>
                      </div>
                      <p className="text-sm font-bold text-blue-600">{course.progress}%</p>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      ></motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring" }}
        className="fixed bottom-8 right-8"
      >
        <Link
          to="/app/interview-setup"
          className="btn-primary btn-pulse w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg hover:shadow-2xl transition-shadow"
        >
          <Plus size={28} />
        </Link>
      </motion.div>
    </div>
  );
}