import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Hash, ArrowRight, Sparkles } from "lucide-react";
import axios from "../../api/axios";

export default function JoinQuiz() {
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    
    setError(null);
    setLoading(true);

    try {
      const res = await axios.post("/sessions/join", { joinCode });
      navigate(`/player/lobby/${res.data.sessionId}`);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to join quiz";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 relative overflow-hidden">
          {/* Decorative Top Gradient */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-blue-500" />

          <div className="text-center mb-8 relative">
            <motion.div
              initial={{ rotate: -10, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-500/20 transform rotate-3 group hover:rotate-6 transition-transform duration-300"
            >
              <Hash className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Join the Action</h2>
            <p className="text-slate-500 font-medium">Enter your game PIN to start</p>
          </div>

          <form onSubmit={handleJoin} className="space-y-6">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl opacity-20 group-hover:opacity-100 transition duration-500 blur"></div>
              <input
                type="text"
                placeholder="GAME PIN"
                value={joinCode}
                onChange={(e) => {
                  setJoinCode(e.target.value.toUpperCase());
                  setError(null);
                }}
                className="relative w-full px-4 py-5 text-center text-3xl font-mono font-black tracking-[0.2em] bg-white border-2 border-slate-100 rounded-xl focus:border-transparent focus:ring-0 outline-none transition-all placeholder:text-slate-300 uppercase text-slate-800 shadow-sm"
                maxLength={8}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center gap-3 text-red-600 bg-red-50/80 backdrop-blur-sm p-4 rounded-xl text-sm font-medium border border-red-100"
              >
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-xs">!</span>
                </div>
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading || !joinCode}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Enter Game
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
              {/* Button Shine Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-slate-500 text-sm font-medium">
          Want to host your own quiz?{" "}
          <button 
            onClick={() => navigate("/quiz/create")}
            className="text-violet-600 font-bold hover:text-violet-700 hover:underline decoration-2 underline-offset-2 transition-colors"
          >
            Create Quiz
          </button>
        </p>
      </motion.div>
    </div>
  );
}
