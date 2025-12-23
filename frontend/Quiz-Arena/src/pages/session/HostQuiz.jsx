import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Users, Clock, ArrowRight, Gamepad2, Zap, Star, Circle, Square, Triangle } from "lucide-react";
import api from "../../api/axios";
import socket from "../../socket";
import Timer from "../../components/session/Timer";

const FloatingShape = ({ icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0.2, 0.5, 0.2],
      scale: [1, 1.2, 1],
      y: [0, -50, 0],
      rotate: [0, 180, 360],
      x: [0, 30, 0]
    }}
    transition={{ 
      duration: 10, 
      repeat: Infinity, 
      delay: delay,
      ease: "easeInOut" 
    }}
    className={`absolute text-${color}-400/30`}
    style={{
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
    }}
  >
    <Icon size={Math.random() * 40 + 20} />
  </motion.div>
);

export default function HostQuiz() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ended, setEnded] = useState(false);
  const [leftMessage, setLeftMessage] = useState(null);

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/sessions/${sessionId}/question`);
      setQuestion(res.data.question);
    } catch (err) {
      if (err.response?.status === 400) {
        setQuestion(null);
      } else {
        console.error(err.response?.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = async () => {
    try {
      const res = await api.post(`/sessions/${sessionId}/next`);

      if (res.data.status === "ended") {
        setEnded(true);
        setQuestion(null);
        setTimeout(() => {
          navigate(`/session/${sessionId}/leaderboard`);
        }, 1500);
      } else {
        fetchQuestion();
      }
    } catch (err) {
      console.error(err.response?.data);
    }
  };

  const handleEndSession = async () => {
    const confirmEnd = window.confirm("Ending the session will remove all players. Continue?");
    if (!confirmEnd) return;

    try {
      await api.post(`/sessions/${sessionId}/leave`);
      socket.emit("leave-session", sessionId);
      socket.disconnect();
      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to end session");
    }
  };

  useEffect(() => {
    socket.emit("join-session", sessionId);
    socket.on("quiz-started", fetchQuestion);
    socket.on("next-question", fetchQuestion);
    
    socket.on("player-left", ({ username }) => {
      setLeftMessage(`${username || "A player"} left the quiz`);
      setTimeout(() => setLeftMessage(null), 3000);
    });

    socket.on("quiz-ended", () => {
      setEnded(true);
      setQuestion(null);
      navigate(`/host/leaderboard/${sessionId}`);
    });

    fetchQuestion();

    return () => {
      socket.off("quiz-started");
      socket.off("next-question");
      socket.off("player-left");
      socket.off("quiz-ended");
    };
  }, [sessionId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const optionColors = [
    "bg-red-500 border-red-600 shadow-red-500/20",
    "bg-blue-500 border-blue-600 shadow-blue-500/20",
    "bg-yellow-500 border-yellow-600 shadow-yellow-500/20",
    "bg-green-500 border-green-600 shadow-green-500/20"
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        {[...Array(20)].map((_, i) => (
          <FloatingShape 
            key={i}
            icon={[Gamepad2, Zap, Star, Circle, Square, Triangle][i % 6]}
            color={['violet', 'fuchsia', 'blue', 'cyan'][i % 4]}
            delay={i * 0.5}
          />
        ))}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-200/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
      </div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-slate-900 text-white px-4 py-1.5 rounded-full font-bold text-sm tracking-wide shadow-lg shadow-slate-900/20">
            HOST MODE
          </div>
          <div className="flex items-center gap-2 text-slate-500 font-mono font-bold bg-white px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="text-xs uppercase tracking-wider text-slate-400">PIN</span>
            <span className="text-slate-700">{sessionId}</span>
          </div>
        </div>
        <button 
          onClick={handleEndSession}
          className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 text-sm border border-transparent hover:border-red-100"
        >
          <LogOut className="w-4 h-4" />
          End Session
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-6xl mx-auto w-full relative z-10">
        <AnimatePresence mode="wait">
          {question ? (
            <motion.div
              key={question._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              {/* Question Card */}
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 text-center mb-8 relative overflow-hidden border border-white/50">
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-8 leading-tight tracking-tight">
                  {question.text}
                </h2>

                {question.endsAt && (
                  <div className="flex justify-center mb-2">
                     <Timer 
                        duration={Math.max(0, Math.ceil((new Date(question.endsAt).getTime() - Date.now()) / 1000))} 
                        onTimeUp={() => {}} 
                      />
                  </div>
                )}
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options.map((opt, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 transform transition-transform hover:scale-[1.01] hover:shadow-md"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shadow-sm text-white
                      ${idx === 0 ? 'bg-red-500' : idx === 1 ? 'bg-blue-500' : idx === 2 ? 'bg-amber-500' : 'bg-green-500'}
                    `}>
                      {['A', 'B', 'C', 'D'][idx]}
                    </div>
                    <span className="text-lg font-bold tracking-tight text-slate-700">{opt}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="text-center">
              <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-200 animate-bounce">
                <Clock className="w-12 h-12 text-slate-400" />
              </div>
              <h2 className="text-3xl font-black text-slate-800 mb-2">Waiting for next question...</h2>
              <p className="text-slate-500 font-medium">Get ready!</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Controls */}
      <div className="bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 sticky bottom-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          {leftMessage && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-xl border border-red-100 font-bold text-sm"
            >
              <span className="flex items-center justify-center w-5 h-5 bg-red-100 rounded-full text-xs">!</span>
              {leftMessage}
            </motion.div>
          )}
          <div className="flex-1"></div>
          <button
            onClick={nextQuestion}
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg shadow-violet-500/30 transition-all flex items-center gap-3 group hover:-translate-y-1"
          >
            Next Question 
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
