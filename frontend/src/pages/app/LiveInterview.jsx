import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Send, Mic, Pause, Play, Volume2, Clock, SkipForward } from "lucide-react";

export default function LiveInterview() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      text: "Hello! I'm your AI interviewer. Let's start with a classic question: Tell me about yourself and your experience.",
      timestamp: new Date()
    }
  ]);
  const [userAnswer, setUserAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [timer, setTimer] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleSendAnswer = () => {
    if (!userAnswer.trim()) return;

    // Add user message
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        type: "user",
        text: userAnswer,
        timestamp: new Date()
      }
    ]);

    setUserAnswer("");

    // Simulate AI thinking + response
    setTimeout(() => {
      const aiResponses = [
        "That's a great answer! I can see you have solid experience. Let me dig deeper - Can you describe a challenging project you worked on?",
        "Good explanation. Now, let's talk about your technical skills. Can you walk me through how you would solve a system design problem?",
        "Interesting! What would you do differently if you were to redo that project?",
        "I see. Let's move to a more technical question. How would you optimize this for performance?"
      ];

      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: "ai",
          text: randomResponse,
          timestamp: new Date()
        }
      ]);

      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 2000);
      setQuestionsAnswered((q) => q + 1);
    }, 800);
  };

  const handleVoiceInput = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate voice recording
      setTimeout(() => {
        setUserAnswer("I have 5 years of experience in software development, specializing in backend systems...");
        setIsRecording(false);
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Technical Interview - Backend Engineer</h1>
            <p className="text-sm text-gray-600">Question {questionsAnswered + 1} of 10 • Intermediate Level</p>
          </div>
        </div>

        {/* Right: Timer & Controls */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock size={18} />
            <span className="font-semibold">{formatTime(timer)}</span>
          </div>
          <Link
            to="/app/feedback"
            className="px-4 py-2 border-2 border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            End Interview
          </Link>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <div className="bg-white px-6 py-3">
        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${((questionsAnswered) / 10) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
        <AnimatePresence>
          {messages.map((message, idx) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`flex gap-4 ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.type === "ai" && (
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🤖</span>
                </div>
              )}

              <div className={`max-w-md ${message.type === "user" ? "lg:max-w-xl" : ""}`}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`px-5 py-4 rounded-lg ${
                    message.type === "ai"
                      ? "bg-gray-100 text-gray-900"
                      : "bg-blue-600 text-white rounded-br-none"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  {message.type === "ai" && isSpeaking && (
                    <div className="flex gap-1 mt-2">
                      <div className="w-1 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                      <div className="w-1 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-1 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  )}
                </motion.div>
                <p className="text-xs text-gray-500 mt-2">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>

              {message.type === "user" && (
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">
                  U
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-t border-gray-200 p-6"
      >
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Transcription Display */}
          {isRecording && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3"
            >
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <p className="text-sm text-blue-900">
                <strong>Recording...</strong> Speak and I'll transcribe in real-time
              </p>
            </motion.div>
          )}

          {/* Text Input */}
          <div className="flex gap-3">
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here or use voice input..."
              rows={3}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-50 resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendAnswer();
                }
              }}
            />

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleVoiceInput}
                className={`p-3 rounded-lg transition-colors ${
                  isRecording
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title="Record voice"
              >
                <Mic size={20} />
              </button>
              <button
                onClick={handleSendAnswer}
                disabled={!userAnswer.trim()}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
                title="Send answer"
              >
                <Send size={20} />
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
            <span className="text-lg">💡</span>
            <div className="text-sm text-gray-600">
              <p className="font-semibold mb-1">Pro Tip:</p>
              <p>Speak naturally. Pause briefly between thoughts. Our AI listens to both content and delivery.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Fallback for older browsers
const AnimatePresence = ({ children }) => <>{children}</>;
