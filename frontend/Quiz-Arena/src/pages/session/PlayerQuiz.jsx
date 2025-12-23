import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Clock, CheckCircle, XCircle, Sparkles, Gamepad2, Zap, Star, Circle, Square, Triangle } from "lucide-react";
import api from "../../api/axios";
import socket from "../../socket";

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

export default function PlayerQuiz() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [totalTime, setTotalTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [waiting, setWaiting] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctIndex, setCorrectIndex] = useState(null);
  const timerRef = useRef(null);

  const handleLeave = async () => {
    const confirmLeave = window.confirm("Are you sure you want to leave the session?");
    if (!confirmLeave) return;

    try {
      await api.post(`/sessions/${sessionId}/leave`);
      socket.emit("leave-session", sessionId);
      socket.disconnect();
      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to leave session");
    }
  };

  const startTimer = (endsAt) => {
    clearInterval(timerRef.current);
    const endTime = new Date(endsAt).getTime();

    timerRef.current = setInterval(() => {
      const diff = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setTimeLeft(diff);

      if (diff === 0) {
        clearInterval(timerRef.current);
        setShowAnswer(true);
      }
    }, 1000);
  };

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/sessions/${sessionId}/question`);
      const q = res.data.question;
      const seconds = Math.ceil((new Date(q.endsAt).getTime() - Date.now()) / 1000);

      setTotalTime(seconds);
      setTimeLeft(seconds);
      setQuestion(q);
      setSelectedOption(null);
      setCorrectIndex(null);
      setShowAnswer(false);
      setWaiting(false);

      startTimer(q.endsAt);
    } catch (err) {
      if (err.response?.status === 400) {
        setQuestion(null);
        setWaiting(true);
      } else {
        console.error("Fetch question error:", err.response?.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (index) => {
    if (selectedOption !== null || showAnswer) return;
    setSelectedOption(index);

    try {
      const res = await api.post(`/sessions/${sessionId}/answer`, {
        questionId: question._id,
        answerIndex: index,
      });
      setCorrectIndex(res.data.correctIndex);
    } catch (err) {
      console.error(err.response?.data);
      alert("Failed to submit answer");
    }
  };

  useEffect(() => {
    socket.emit("join-session", sessionId);
    socket.on("quiz-started", fetchQuestion);
    socket.on("next-question", fetchQuestion);
    
    socket.on("quiz-ended", () => {
      navigate(`/player/leaderboard/${sessionId}`);
    });

    fetchQuestion();

    return () => {
      clearInterval(timerRef.current);
      socket.off("quiz-started");
      socket.off("next-question");
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

  if (waiting || !question) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50 relative overflow-hidden">
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

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 relative z-10 max-w-md w-full"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg shadow-violet-500/30 animate-pulse">
            <Clock className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">Get Ready!</h2>
          <p className="text-slate-500 font-medium">Waiting for the next question...</p>
        </motion.div>
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
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          <Clock className="w-5 h-5 text-violet-600" />
          <span className="font-mono font-bold text-slate-700 text-lg">{timeLeft}s</span>
        </div>
        <button 
          onClick={handleLeave}
          className="text-slate-400 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 text-sm border border-transparent hover:border-red-100"
        >
          <LogOut className="w-4 h-4" />
          Leave Quiz
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6 max-w-3xl mx-auto w-full relative z-10">
        <div className="flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-8 mb-8 text-center border border-white/50 relative overflow-hidden"
          >
            <h2 className="text-xl md:text-2xl font-black text-slate-800 leading-tight">
              {question.text}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = showAnswer && idx === correctIndex;
              const isWrong = showAnswer && isSelected && idx !== correctIndex;
              const showStatus = showAnswer && (isCorrect || isWrong);

              return (
                <motion.button
                  key={idx}
                  whileHover={!selectedOption && !showAnswer ? { scale: 1.02 } : {}}
                  whileTap={!selectedOption && !showAnswer ? { scale: 0.98 } : {}}
                  onClick={() => submitAnswer(idx)}
                  disabled={selectedOption !== null || showAnswer}
                  className={`
                    relative p-5 rounded-2xl text-left transition-all duration-200 border shadow-sm flex items-center justify-between group
                    ${!selectedOption && !showAnswer ? 'bg-white/90 backdrop-blur-sm border-slate-200 hover:border-violet-300 hover:shadow-md hover:bg-white' : ''}
                    ${isSelected && !showAnswer ? 'bg-slate-900 border-slate-900 text-white shadow-lg ring-4 ring-slate-100' : ''}
                    ${showAnswer && isCorrect ? 'bg-green-500 border-green-600 text-white shadow-green-500/30 shadow-lg' : ''}
                    ${showAnswer && isWrong ? 'bg-red-500 border-red-600 text-white shadow-red-500/30 shadow-lg' : ''}
                    ${showAnswer && !isCorrect && !isWrong ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-70' : ''}
                  `}
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shrink-0 transition-colors
                      ${isSelected && !showAnswer ? 'bg-slate-800 text-white' : ''}
                      ${showAnswer && isCorrect ? 'bg-green-600 text-white' : ''}
                      ${showAnswer && isWrong ? 'bg-red-600 text-white' : ''}
                      ${!isSelected && !showAnswer ? 
                        (idx === 0 ? 'bg-red-100 text-red-600' : 
                         idx === 1 ? 'bg-blue-100 text-blue-600' : 
                         idx === 2 ? 'bg-amber-100 text-amber-600' : 
                         'bg-green-100 text-green-600') 
                        : ''}
                      ${showAnswer && !isCorrect && !isWrong ? 'bg-slate-200 text-slate-400' : ''}
                    `}>
                      {['A', 'B', 'C', 'D'][idx]}
                    </div>
                    <span className={`font-bold text-lg leading-tight ${
                      (isSelected || (showAnswer && (isCorrect || isWrong))) ? 'text-white' : 'text-slate-700'
                    }`}>
                      {opt}
                    </span>
                  </div>

                  {showStatus && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <XCircle className="w-6 h-6 text-white" />
                      )}
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Status Message */}
        <AnimatePresence>
          {selectedOption !== null && !showAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 z-30"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="font-bold">Answer submitted! Waiting for others...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
