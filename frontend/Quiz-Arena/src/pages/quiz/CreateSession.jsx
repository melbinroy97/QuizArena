import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Copy, Check, ArrowRight, Sparkles } from "lucide-react";
import axios from "../../api/axios";

export default function CreateSession() {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [joinCode, setJoinCode] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCreateSession = async () => {
    if (!quizId) {
      setError("Missing quizId. Please select a quiz from your library.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/sessions", { quizId });
      setJoinCode(res.data.joinCode);
      setSessionId(res.data.sessionId);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Failed to create session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(joinCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-fuchsia-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 relative overflow-hidden">
          {/* Decorative Top Gradient */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-blue-500" />

          <div className="text-center mb-8 relative">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-500/20 transform -rotate-3 group hover:rotate-0 transition-transform duration-300"
            >
              <Play className="w-10 h-10 text-white fill-current ml-1" />
            </motion.div>
            
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Host Live Session</h2>
            <p className="text-slate-500 font-medium">
              Create a live game session for your players to join.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6 flex items-center gap-3 text-red-600 bg-red-50/80 backdrop-blur-sm p-4 rounded-xl text-sm font-medium border border-red-100"
            >
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-xs">!</span>
              </div>
              {error}
            </motion.div>
          )}

          {!joinCode ? (
            <button
              onClick={handleCreateSession}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Start Session
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
              {/* Button Shine Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200/60 relative group hover:border-violet-300 transition-colors">
                <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-[0.2em] text-center">Join Code</p>
                <div className="flex items-center justify-center gap-4">
                  <span className="text-5xl font-mono font-black text-slate-800 tracking-widest group-hover:scale-105 transition-transform duration-300">
                    {joinCode}
                  </span>
                  <button
                    onClick={copyCode}
                    className="p-3 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-violet-600 hover:shadow-md active:scale-95"
                    title="Copy Code"
                  >
                    {copied ? <Check className="w-6 h-6 text-green-500" /> : <Copy className="w-6 h-6" />}
                  </button>
                </div>
              </div>

              <button
                onClick={() => navigate(`/host/lobby/${sessionId}`)}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-lg shadow-lg shadow-slate-900/20 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Go to Lobby</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
