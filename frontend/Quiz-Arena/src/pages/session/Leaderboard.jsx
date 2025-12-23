import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api/axios";
import socket from "../../socket";
import Confetti from "react-confetti";

export default function Leaderboard() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/sessions/${sessionId}/leaderboard`);
      setLeaderboard(res.data.leaderboard || []);
      setStatus(res.data.status);
    } catch (err) {
      console.error("Leaderboard fetch error:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    socket.on("leaderboard-update", fetchLeaderboard);
    return () => {
      socket.off("leaderboard-update", fetchLeaderboard);
    };
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 relative overflow-hidden">
      {status === "ended" && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />}
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <span className="w-10 h-10 text-yellow-500 text-3xl">🏆</span>
            Leaderboard
          </h1>
          <p className="text-gray-600">
            {status === "ended" ? "The quiz has ended! Here are the final results." : "Current standings"}
          </p>
        </motion.div>

        {/* Podium */}
        {topThree.length > 0 && (
          <div className="flex justify-center items-end gap-4 mb-12 h-64">
            {/* 2nd Place */}
            {topThree[1] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "70%", opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-1/3 max-w-[120px] flex flex-col items-center"
              >
                <div className="mb-2 text-center">
                  <div className="font-bold text-gray-800 truncate w-full">{topThree[1].username}</div>
                  <div className="text-sm text-gray-500">{topThree[1].score} pts</div>
                </div>
                <div className="w-full h-full bg-gradient-to-t from-gray-300 to-gray-100 rounded-t-lg shadow-lg flex items-start justify-center pt-4 border-t-4 border-gray-400">
                  <span className="w-8 h-8 text-gray-400 text-2xl">🥈</span>
                </div>
              </motion.div>
            )}

            {/* 1st Place */}
            {topThree[0] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "100%", opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="w-1/3 max-w-[140px] flex flex-col items-center z-10"
              >
                <div className="mb-2 text-center">
                  <div className="font-bold text-gray-900 text-lg truncate w-full">{topThree[0].username}</div>
                  <div className="text-sm text-violet-600 font-bold">{topThree[0].score} pts</div>
                </div>
                <div className="w-full h-full bg-gradient-to-t from-yellow-200 to-yellow-50 rounded-t-lg shadow-xl flex items-start justify-center pt-4 border-t-4 border-yellow-400 relative">
                  <span className="w-10 h-10 text-yellow-500 text-3xl">🥇</span>
                  <div className="absolute -top-6">
                    <span className="w-12 h-12 text-yellow-500 text-4xl drop-shadow-lg">🏆</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3rd Place */}
            {topThree[2] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "50%", opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="w-1/3 max-w-[120px] flex flex-col items-center"
              >
                <div className="mb-2 text-center">
                  <div className="font-bold text-gray-800 truncate w-full">{topThree[2].username}</div>
                  <div className="text-sm text-gray-500">{topThree[2].score} pts</div>
                </div>
                <div className="w-full h-full bg-gradient-to-t from-orange-200 to-orange-50 rounded-t-lg shadow-lg flex items-start justify-center pt-4 border-t-4 border-orange-400">
                  <span className="w-8 h-8 text-orange-500 text-2xl">🥉</span>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* List for the rest */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {rest.map((player, idx) => (
            <motion.div
              key={player.userId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + idx * 0.1 }}
              className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full font-bold text-gray-500 text-sm">
                  {idx + 4}
                </span>
                <span className="font-medium text-gray-900">{player.username}</span>
              </div>
              <span className="font-bold text-violet-600">{player.score} pts</span>
            </motion.div>
          ))}
          
          {leaderboard.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No players yet.
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium shadow-sm"
          >
            <span className="text-lg">🏠</span>
            Dashboard
          </button>
          {status !== "ended" && (
             <div className="flex items-center gap-2 text-violet-600 animate-pulse">
               <span className="w-2 h-2 bg-violet-600 rounded-full"></span>
               Waiting for next question...
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
