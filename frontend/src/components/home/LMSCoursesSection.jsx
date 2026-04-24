

import { motion } from "framer-motion";
import { ArrowRight, Clock, Users, Star } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "Data Science",
    subtitle: "Master the Art of Data",
    description:
      "Python, Pandas, NumPy, Machine Learning and real-world projects — become a Data Scientist.",
    icon: "📊",
    skills: ["Python", "ML Algorithms", "Statistics"],
    duration: "6 Months",
    students: "2,400+",
    rating: "4.9",
  },
  {
    id: 2,
    title: "Data Analytics",
    subtitle: "Turn Data into Decisions",
    description:
      "SQL, Excel, Power BI and Tableau — build dashboards and extract insights.",
    icon: "📈",
    skills: ["SQL", "Power BI", "Tableau"],
    duration: "4 Months",
    students: "1,800+",
    rating: "4.8",
  },
  {
    id: 3,
    title: "AI / LLM",
    subtitle: "Build the Future with AI",
    description:
      "Generative AI, LangChain, OpenAI APIs — build modern AI applications.",
    icon: "🤖",
    skills: ["LangChain", "OpenAI", "RAG"],
    duration: "5 Months",
    students: "1,200+",
    rating: "4.9",
  },
  {
    id: 4,
    title: "Digital Marketing",
    subtitle: "Grow Brands Digitally",
    description:
      "SEO, Ads, Social Media Marketing — build real-world marketing skills.",
    icon: "📣",
    skills: ["SEO", "Google Ads", "Content"],
    duration: "3 Months",
    students: "3,100+",
    rating: "4.7",
  },
];

const LMS_URL = "https://hilearn-lms-tool.vercel.app/courses";

export default function LMSCoursesSection() {
  return (
    <section className="bg-[#f4f2ee] pt-20">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header – now matches testimonial section exactly */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-14 text-center"
        >
          <p className="text-sm uppercase tracking-[0.24em] text-[#c8601a] font-semibold">
            TOP COURSES
          </p>
          <h2 className="display-font mt-3 text-4xl font-bold text-[#0f1f3d] md:text-5xl">
            Explore Our Top Courses
          </h2>
          <p className="text-gray-600 max-w-xl text-lg mx-auto mt-4">
            Industry-relevant courses with real projects, mentorship, and interview practice.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="rounded-2xl bg-white border border-[#e0dbd3] p-6 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-100 text-2xl mb-4">
                {course.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-[#0f1f3d]">
                {course.title}
              </h3>

              <p className="text-[#c8601a] text-sm font-medium mb-2">
                {course.subtitle}
              </p>

              {/* Description */}
              <p className="text-[#5c5a57] text-sm leading-relaxed mb-4">
                {course.description}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-5">
                {course.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  {course.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  {course.students}
                </div>
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-orange-400 fill-orange-400" />
                  {course.rating}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 rounded-2xl border border-[#e0dbd3] bg-[#f8f6f2] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-[#0f1f3d]">
              All courses include AI-powered mock interviews
            </p>
            <p className="text-gray-600 text-sm">
              Practice with confidence and improve every day.
            </p>
          </div>

          <a
            href={LMS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#c8601a] text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-[#b0541a] transition"
          >
            View All Courses
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}