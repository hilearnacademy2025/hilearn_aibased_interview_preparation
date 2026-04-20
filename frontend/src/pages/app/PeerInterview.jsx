import { useState } from "react";
import { motion } from "framer-motion";
import { Users, MapPin, Award, Clock, MessageSquare, Video, CheckCircle } from "lucide-react";

export default function PeerInterview() {
  const [selectedTab, setSelectedTab] = useState("find");

  const availablePeers = [
    {
      id: 1,
      name: "Arjun Kumar",
      role: "Backend Engineer",
      experience: "3 years",
      location: "Bangalore",
      expertise: "System Design, DSA",
      rating: 4.8,
      reviews: 24,
      available: "Now",
      avatar: "AK"
    },
    {
      id: 2,
      name: "Priya Sharma",
      role: "Frontend Developer",
      experience: "2 years",
      location: "Delhi",
      expertise: "React, Performance",
      rating: 4.9,
      reviews: 31,
      available: "5 min",
      avatar: "PS"
    },
    {
      id: 3,
      name: "Rohan Patel",
      role: "Full Stack",
      experience: "4 years",
      location: "Mumbai",
      expertise: "System Design, Startup",
      rating: 4.7,
      reviews: 18,
      available: "10 min",
      avatar: "RP"
    },
  ];

  const upcomingSessions = [
    {
      id: 1,
      peer: "Aisha Singh",
      role: "Frontend Developer",
      time: "Tomorrow, 3:00 PM",
      type: "Technical",
      status: "Confirmed",
      avatar: "AS"
    },
    {
      id: 2,
      peer: "Vikas Reddy",
      role: "Backend Engineer",
      time: "Friday, 6:00 PM",
      type: "Behavioral",
      status: "Confirmed",
      avatar: "VR"
    },
  ];

  const completedSessions = [
    {
      id: 1,
      peer: "Neha Gupta",
      role: "Data Scientist",
      date: "Nov 15",
      type: "Problem Solving",
      rating: 5,
      feedback: "Great communication and clear explanations"
    },
    {
      id: 2,
      peer: "Rohit Verma",
      role: "Backend Engineer",
      date: "Nov 12",
      type: "Technical",
      rating: 4,
      feedback: "Good discussion on scalability"
    },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Peer Practice Interviews</h1>
        <p className="text-gray-600">Connect with other students for realistic mock interviews</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        {[
          { id: "find", label: "Find Peer", icon: "🔍" },
          { id: "upcoming", label: "Upcoming", icon: "📅" },
          { id: "completed", label: "Completed", icon: "✅" },
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
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Find Peer Tab */}
      {selectedTab === "find" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Filters */}
          <div className="flex gap-3 flex-wrap">
            {["System Design", "DSA", "Behavioral", "HR"].map((filter) => (
              <button key={filter} className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:border-blue-600 hover:text-blue-600 transition-colors">
                {filter}
              </button>
            ))}
          </div>

          {/* Peers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availablePeers.map((peer, idx) => (
              <motion.div
                key={peer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {peer.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{peer.name}</p>
                      <p className="text-sm text-gray-600">{peer.role}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">
                    {peer.available}
                  </span>
                </div>

                {/* Info */}
                <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} />
                    {peer.experience} experience
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} />
                    {peer.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Award size={16} />
                    {peer.expertise}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.floor(peer.rating) ? "text-yellow-400" : "text-gray-300"}>★</span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">{peer.rating} ({peer.reviews} reviews)</p>
                </div>

                {/* CTA */}
                <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Schedule Session
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Upcoming Tab */}
      {selectedTab === "upcoming" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {upcomingSessions.length > 0 ? (
            upcomingSessions.map((session, idx) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-between"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-600">
                    {session.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{session.peer}</p>
                    <p className="text-sm text-gray-600">{session.role}</p>
                    <div className="flex gap-4 text-sm text-gray-600 mt-2">
                      <span>📅 {session.time}</span>
                      <span>💻 {session.type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-700 hover:border-gray-400">
                    <MessageSquare size={18} />
                    Message
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    <Video size={18} />
                    Join
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No upcoming sessions scheduled</p>
              <button onClick={() => setSelectedTab("find")} className="text-blue-600 font-semibold hover:underline">
                Find a peer to practice with
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Completed Tab */}
      {selectedTab === "completed" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {completedSessions.map((session, idx) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-bold text-gray-900">{session.peer}</p>
                  <p className="text-sm text-gray-600">{session.role} • {session.date}</p>
                </div>
                <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded">
                  {session.type}
                </span>
              </div>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < session.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
                ))}
              </div>
              <p className="text-gray-700">"{session.feedback}"</p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
