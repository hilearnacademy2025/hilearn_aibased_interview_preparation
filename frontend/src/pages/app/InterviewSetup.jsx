import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Upload, ChevronRight } from "lucide-react";

export default function InterviewSetup() {
  const [formData, setFormData] = useState({
    jobRole: "",
    interviewType: "technical",
    difficulty: "intermediate",
    techStack: "",
    resumeFile: null,
  });

  const interviewTypes = [
    { id: "technical", name: "Technical", icon: "💻", desc: "DSA, System Design, Coding" },
    { id: "hr", name: "HR Round", icon: "🤝", desc: "HR, Culture fit" },
    { id: "behavioral", name: "Behavioral", icon: "🧠", desc: "STAR, examples" },
    { id: "domain", name: "Domain", icon: "🎯", desc: "Role-specific" },
  ];

  const difficulties = [
    { id: "beginner", name: "Beginner" },
    { id: "intermediate", name: "Intermediate" },
    { id: "advanced", name: "Advanced" },
  ];

  const jobRoles = [
    "Backend Engineer",
    "Frontend Developer",
    "Full Stack Engineer",
    "Data Scientist",
    "Product Manager",
    "Mobile Developer",
    "DevOps Engineer",
    "QA Engineer",
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Start a New Interview</h1>
        <p className="text-gray-600">Configure your interview settings and let's get started</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-200 p-8 space-y-8"
      >
        {/* Job Role Selection */}
        <div>
          <label className="block text-lg font-bold text-gray-900 mb-4">
            Target Job Role *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {jobRoles.map((role) => (
              <button
                key={role}
                onClick={() => setFormData({ ...formData, jobRole: role })}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  formData.jobRole === role
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <p className="font-semibold text-gray-900">{role}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Interview Type */}
        <div>
          <label className="block text-lg font-bold text-gray-900 mb-4">
            Interview Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {interviewTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setFormData({ ...formData, interviewType: type.id })}
                className={`p-4 rounded-lg border-2 text-center transition-all ${
                  formData.interviewType === type.id
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-3xl mb-2">{type.icon}</div>
                <p className="font-semibold text-sm text-gray-900">{type.name}</p>
                <p className="text-xs text-gray-600 mt-1">{type.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Level */}
        <div>
          <label className="block text-lg font-bold text-gray-900 mb-4">
            Difficulty Level
          </label>
          <div className="flex gap-3">
            {difficulties.map((diff) => (
              <button
                key={diff.id}
                onClick={() => setFormData({ ...formData, difficulty: diff.id })}
                className={`flex-1 py-3 rounded-lg border-2 font-semibold transition-all ${
                  formData.difficulty === diff.id
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {diff.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <label className="block text-lg font-bold text-gray-900 mb-3">
            Tech Stack (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Python, FastAPI, PostgreSQL, React"
            value={formData.techStack}
            onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-50"
          />
          <p className="text-sm text-gray-600 mt-2">AI will use this to tailor questions</p>
        </div>

        {/* Resume Upload */}
        <div>
          <label className="block text-lg font-bold text-gray-900 mb-3">
            Upload Resume (Optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-600 hover:bg-blue-50 transition-colors cursor-pointer">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="font-semibold text-gray-900">Drag & drop your resume</p>
            <p className="text-sm text-gray-600">or click to select from your computer</p>
            <p className="text-xs text-gray-500 mt-2">PDF, DOC, DOCX (max 5MB)</p>
          </div>
        </div>

        {/* Interview Duration Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>⏱️ Interview Duration:</strong> 15-25 minutes depending on your answers. You can take breaks between questions.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4">
          <Link
            to="/app/interview"
            className="flex-1 bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 group"
          >
            Start Interview Now <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/app/dashboard"
            className="px-6 py-4 border-2 border-gray-300 rounded-lg font-semibold text-gray-900 hover:border-gray-400 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
