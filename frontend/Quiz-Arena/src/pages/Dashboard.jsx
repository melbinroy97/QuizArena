import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Trophy, Clock, CheckCircle, XCircle, Calendar, BarChart2 } from "lucide-react";
import api from "../api/axios";
import QuizCard from "../components/QuizCard";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function Dashboard() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gameCode, setGameCode] = useState("");
  
  // Activity Tab State
  const [activeTab, setActiveTab] = useState("created");
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await api.get("/quizzes/my");
        setQuizzes(res.data.quizzes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (activeTab === "completed" && history.length === 0) {
      const fetchHistory = async () => {
        setHistoryLoading(true);
        try {
          const res = await api.get("/sessions/history");
          setHistory(res.data.history);
        } catch (err) {
          console.error(err);
        } finally {
          setHistoryLoading(false);
        }
      };
      fetchHistory();
    }
  }, [activeTab]);

  const handleJoinGame = async (e) => {
    e.preventDefault();
    if (!gameCode.trim()) return;

    try {
      const res = await api.post("/sessions/join", { joinCode: gameCode });
      navigate(`/player/lobby/${res.data.sessionId}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to join session");
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;

    try {
      await api.delete(`/quizzes/${quizId}`);
      setQuizzes(quizzes.filter((q) => q._id !== quizId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete quiz");
    }
  };

  return (
    <div className="p-24 space-y-12">
      {/* Hero / Join Game Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-purple-600 to-accent p-8 md:p-12 text-white shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 ">Ready to compete?</h1>
            <p className="text-violet-100 text-lg mb-8 max-w-md">
              Enter a game code to join a live session instantly.
            </p>

            <form onSubmit={handleJoinGame} className="flex flex-col sm:flex-row gap-4 max-w-md">
              <input
                type="text"
                placeholder="GAME CODE"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                className="flex-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl px-6 py-4 text-white placeholder-white/60 focus:outline-none focus:bg-white/30 transition-all font-bold tracking-wider"
              />
              <button 
                type="submit"
                className="bg-white text-violet-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-lg"
              >
                JOIN
              </button>
            </form>
          </div>

          {/* Floating stats card on the right, similar to design reference */}
          <div className="hidden md:flex justify-end">
            <motion.div
              initial={{ opacity: 0, y: 24, rotate: 6 }}
              animate={{ opacity: 1, y: 0, rotate: 6 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 w-80"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center text-lg font-bold shadow-lg">
                  JS
                </div>
                <div>
                  <h3 className="font-bold text-xl leading-tight">JS Master</h3>
                  <p className="text-violet-200 text-sm">1,240 pts</p>
                </div>
              </div>
              <div className="h-3 w-full rounded-full bg-black/20 overflow-hidden">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-pink-500 to-rose-500" />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Activity Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Activity</h2>
            <p className="text-gray-500">Track your quizzes and performance</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab("created")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "created" 
                    ? "bg-white text-violet-600 shadow-sm" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Created
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "completed" 
                    ? "bg-white text-violet-600 shadow-sm" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Completed
              </button>
            </div>

            {activeTab === "created" && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/quiz/create" 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/30 text-sm"
                >
                  <Plus size={18} />
                  Create Quiz
                </Link>
              </motion.div>
            )}
          </div>
        </div>

        {activeTab === "created" ? (
          loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : quizzes.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white rounded-3xl border border-gray-100 border-dashed"
            >
              <motion.div 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                  <Trophy className="w-8 h-8 text-gray-400" />
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No quizzes yet</h3>
              <p className="text-gray-500 mb-6">Create your first quiz to get started!</p>
              <Link to="/quiz/create" className="text-violet-600 font-medium hover:text-violet-700">
                Create a Quiz &rarr;
              </Link>
            </motion.div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {quizzes.map((quiz) => (
                <motion.div key={quiz._id} variants={itemVariants} layout>
                  <QuizCard
                    quiz={quiz}
                    onHost={() => navigate(`/quiz/${quiz._id}/session/create`)}
                    onDelete={() => handleDeleteQuiz(quiz._id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )
        ) : (
          // Completed / History Tab
          historyLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 border-dashed">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart2 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No history yet</h3>
              <p className="text-gray-500">Join a game to start building your history!</p>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {history.map((session) => (
                <motion.div 
                  key={session.sessionId} 
                  variants={itemVariants}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{session.quizTitle}</h3>
                      <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                        <Calendar size={14} />
                        {new Date(session.playedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                      session.accuracy >= 80 ? "bg-green-100 text-green-700" :
                      session.accuracy >= 50 ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {session.accuracy}%
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Score</span>
                      <span className="font-bold text-gray-900">{session.score} pts</span>
                    </div>
                    
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          session.accuracy >= 80 ? "bg-green-500" :
                          session.accuracy >= 50 ? "bg-yellow-500" :
                          "bg-red-500"
                        }`}
                        style={{ width: `${session.accuracy}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="bg-green-50 rounded-lg p-2 flex items-center gap-2 text-sm text-green-700">
                        <CheckCircle size={16} />
                        <span>{session.correctAnswers} Correct</span>
                      </div>
                      <div className="bg-red-50 rounded-lg p-2 flex items-center gap-2 text-sm text-red-700">
                        <XCircle size={16} />
                        <span>{session.totalQuestions - session.correctAnswers} Wrong</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )
        )}
      </motion.div>
    </div>
  );
}
