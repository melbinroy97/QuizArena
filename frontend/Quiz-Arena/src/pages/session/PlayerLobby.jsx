import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Ticket, LogOut, Sparkles, Gamepad2, Zap, Star, Circle, Square, Triangle } from "lucide-react";
import socket from "../../socket";
import api from "../../api/axios";

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

export default function PlayerLobby() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState("");

  useEffect(() => {
    const fetchSession = async () => {
      try {
        // Use leaderboard endpoint since it returns joinCode and is public/protected
        const res = await api.get(`/sessions/${sessionId}/leaderboard`);
        if (res.data.joinCode) {
          setJoinCode(res.data.joinCode);
        }
      } catch (err) {
        console.error("Failed to fetch session:", err);
      }
    };
    fetchSession();

    socket.emit("join-session", sessionId);

    socket.on("quiz-started", () => {
      navigate(`/player/quiz/${sessionId}`);
    });

    socket.on("player-left", ({ userId }) => {
      console.log("Player left:", userId);
    });

    return () => {
      socket.off("quiz-started");
      socket.off("player-left");
    };
  }, [sessionId, navigate]);

  const handleLeave = async () => {
    const confirmLeave = window.confirm("Are you sure you want to leave the session?");
    if (!confirmLeave) return;

    try {
      await api.post(`/sessions/${sessionId}/leave`);
      socket.emit("leave-session", sessionId);
      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to leave session");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Floating Icons */}
        {[...Array(15)].map((_, i) => (
          <FloatingShape 
            key={i} 
            icon={[Gamepad2, Zap, Star, Circle, Square, Triangle][i % 6]} 
            color={['violet', 'fuchsia', 'blue', 'indigo', 'purple', 'pink'][i % 6]}
            delay={i * 0.5}
          />
        ))}

        {/* Gradient Blobs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-violet-300/20 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-300/20 rounded-full blur-3xl" 
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Ticket Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/50 relative">
          {/* Decorative Top Pattern */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-blue-500" />
          
          {/* Header */}
          <div className="bg-slate-50/50 p-8 text-center border-b border-slate-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />
            
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-violet-500/30 relative rotate-3"
            >
              <Gamepad2 className="w-8 h-8 text-white" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-black text-slate-900 mb-1 tracking-tight"
            >
              You're In!
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-slate-500 font-medium text-sm"
            >
              Get ready to compete
            </motion.p>
          </div>

          {/* Body */}
          <div className="p-8 space-y-8 bg-white relative">
            {/* Ticket Cutouts */}
            <div className="absolute top-0 left-0 w-6 h-6 bg-slate-50 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-inner" />
            <div className="absolute top-0 right-0 w-6 h-6 bg-slate-50 rounded-full translate-x-1/2 -translate-y-1/2 shadow-inner" />

            {/* Game Pin Display */}
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                <Ticket className="w-4 h-4" />
                Game PIN
              </div>
              <div className="bg-slate-50 rounded-2xl py-6 border-2 border-dashed border-slate-200 relative group hover:border-violet-300 transition-colors">
                <p className="text-5xl font-mono font-black text-slate-800 tracking-widest group-hover:scale-110 transition-transform duration-300">
                  {joinCode || "..."}
                </p>
              </div>
            </div>

            {/* Waiting Animation */}
            <div className="flex flex-col items-center gap-4 py-2">
              <div className="flex gap-3">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3],
                      backgroundColor: ["#8b5cf6", "#d946ef", "#8b5cf6"]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                    className="w-4 h-4 rounded-full"
                  />
                ))}
              </div>
              <p className="text-sm font-bold text-slate-400 animate-pulse uppercase tracking-wide">
                Waiting for host to start...
              </p>
            </div>

            {/* Leave Button */}
            <button
              onClick={handleLeave}
              className="w-full py-4 px-6 rounded-xl text-red-500 font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2 group border border-transparent hover:border-red-100"
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Leave Lobby</span>
            </button>
          </div>
        </div>

        {/* Footer Text */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-slate-400 text-sm mt-8 font-medium"
        >
          Keep this window open
        </motion.p>
      </motion.div>
    </div>
  );
}
