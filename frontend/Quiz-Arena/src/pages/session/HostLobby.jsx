import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Users, Play, LogOut, Trophy, Gamepad2, Zap, Star, Circle, Square, Triangle } from "lucide-react";
import socket from "../../socket";
import axios from "../../api/axios";

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

export default function HostLobby() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [joinCode, setJoinCode] = useState("");
  const [leftMessage, setLeftMessage] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchParticipants = async () => {
    try {
      const res = await axios.get(`/sessions/${sessionId}/leaderboard`);
      setParticipants(res.data.leaderboard || []);
      if (res.data.joinCode) setJoinCode(res.data.joinCode);
    } catch (err) {
      console.error("Fetch participants error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    socket.emit("join-session", sessionId);

    socket.on("player-joined", fetchParticipants);

    socket.on("player-left", ({ username }) => {
      setLeftMessage(`${username || "A player"} left the session`);
      fetchParticipants();
      setTimeout(() => setLeftMessage(null), 3000);
    });

    socket.on("quiz-started", () => {
      navigate(`/host/quiz/${sessionId}`);
    });

    fetchParticipants();

    return () => {
      socket.off("player-joined", fetchParticipants);
      socket.off("player-left");
      socket.off("quiz-started");
    };
  }, [sessionId, navigate]);

  const startQuiz = async () => {
    try {
      await axios.post(`/sessions/${sessionId}/start`);
    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data?.message || "Failed to start quiz");
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(joinCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Floating Icons */}
        {[...Array(20)].map((_, i) => (
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
          className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-violet-300/20 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-fuchsia-300/20 rounded-full blur-3xl" 
        />
      </div>

      <div className="w-full max-w-5xl space-y-12 relative z-10">
        
        {/* Header Section */}
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-20 h-20 bg-white rounded-2xl shadow-xl mx-auto flex items-center justify-center mb-6 rotate-3 hover:rotate-6 transition-transform"
          >
            <Trophy className="w-10 h-10 text-yellow-500" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight"
          >
            Waiting Room
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-500 font-medium"
          >
            Share the code below to invite players
          </motion.p>
        </div>

        {/* Join Code Card */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={copyCode}
            className="relative group cursor-pointer"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500 animate-gradient-xy" />
            <div className="relative bg-white px-12 py-8 rounded-2xl shadow-2xl border border-white/50 flex flex-col items-center min-w-[360px]">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-4">
                Join Code
              </div>
              <div className="flex items-center gap-6">
                <span className="text-6xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-600 tracking-wider">
                  {joinCode || "..."}
                </span>
                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-violet-50 transition-colors">
                  <Copy className={`w-6 h-6 ${copied ? "text-green-500" : "text-slate-400 group-hover:text-violet-500"}`} />
                </div>
              </div>
              
              <AnimatePresence>
                {copied && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute -bottom-12 left-0 right-0 text-center"
                  >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 text-white text-sm font-bold shadow-lg">
                      <span>✓</span> Copied to clipboard!
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.button>
        </motion.div>

        {/* Participants Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                <Users className="w-6 h-6 text-violet-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Players Joined
                <span className="ml-3 text-lg font-bold text-violet-600 bg-violet-50 px-3 py-1 rounded-full">
                  {participants.length}
                </span>
              </h2>
            </div>
          </div>

          <div className="min-h-[300px] bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-xl p-8">
            {participants.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-6 py-20">
                <div className="relative">
                  <div className="absolute inset-0 bg-violet-200 rounded-full blur-xl animate-pulse" />
                  <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl shadow-lg animate-bounce">
                    ⏳
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-2xl font-bold text-slate-700">Waiting for players...</p>
                  <p className="text-slate-500">The game will start once you're ready!</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <AnimatePresence mode="popLayout">
                  {participants.map((p, i) => (
                    <motion.div
                      key={p.userId}
                      layout
                      initial={{ scale: 0.8, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ type: "spring", delay: i * 0.05 }}
                      className="group relative bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-violet-200 hover:-translate-y-1 transition-all duration-300 flex items-center gap-4"
                    >
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform overflow-hidden relative">
                          <span className="absolute inset-0 flex items-center justify-center">
                            {(p.fullName || p.username)?.[0]?.toUpperCase() || "?"}
                          </span>
                          {p.avatar && (
                            <img 
                              src={p.avatar} 
                              alt="Avatar" 
                              className="w-full h-full object-cover relative z-10" 
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://api.dicebear.com/9.x/adventurer/svg?seed=${p.username}`;
                              }}
                            />
                          )}
                        </div>
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full animate-pulse" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-slate-900 truncate group-hover:text-violet-600 transition-colors">
                          {p.fullName || p.username}
                        </p>
                        <p className="text-xs font-medium text-slate-400 truncate">
                          @{p.username}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          <AnimatePresence>
            {leftMessage && (
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                className="fixed bottom-8 right-8 bg-white border-l-4 border-red-500 shadow-2xl rounded-xl p-4 flex items-center gap-4 z-50 pr-8"
              >
                <div className="p-2 bg-red-50 rounded-full">
                  <LogOut className="w-5 h-5 text-red-500" />
                </div>
                <p className="text-slate-800 font-bold">{leftMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Section */}
        <div className="flex flex-col items-center space-y-6 pt-8 pb-20">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startQuiz}
            disabled={participants.length === 0}
            className="group relative w-full max-w-md h-20 rounded-3xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-2xl font-black shadow-2xl shadow-violet-500/40 hover:shadow-violet-500/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            <div className="relative flex items-center justify-center gap-4">
              <span>{participants.length === 0 ? "Waiting for Players..." : "Start Session"}</span>
              {participants.length > 0 && <Play className="w-8 h-8 fill-current group-hover:translate-x-2 transition-transform" />}
            </div>
          </motion.button>
          
          {participants.length === 0 && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-medium text-slate-400 bg-white px-6 py-2 rounded-full shadow-sm border border-slate-100"
            >
              Waiting for at least one player to join...
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}
