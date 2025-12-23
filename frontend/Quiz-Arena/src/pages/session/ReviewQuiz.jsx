import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api/axios";
import Confetti from "react-confetti";

export default function ReviewQuiz() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await api.get(`/sessions/${sessionId}/review`);
        setReview(res.data.review);
        setLeaderboard(res.data.leaderboard);
      } catch (err) {
        console.error(err.response?.data);
      } finally {
        setLoading(false);
      }
    };
    fetchReview();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const winner = leaderboard[0];
  const isWinner = winner && review.length > 0; // Simple check, ideally check user ID

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {isWinner && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={300} />}

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <span className="text-lg">←</span>
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Quiz Review</h1>
        </div>

        {/* Winner Card */}
        {winner && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-yellow-100 to-orange-50 border border-yellow-200 p-8 rounded-2xl text-center shadow-sm mb-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="w-32 h-32 text-yellow-600 text-6xl">🏆</span>
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="w-8 h-8 text-yellow-600 text-3xl">🏆</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">Champion</h2>
              <div className="text-3xl font-bold text-gray-900 mb-2">{winner.username || winner.fullName}</div>
              <div className="inline-block px-4 py-1 bg-yellow-200 text-yellow-800 rounded-full font-bold text-sm">
                {winner.score} Points
              </div>
            </div>
          </motion.div>
        )}

        {/* Questions Review */}
        <div className="space-y-6">
          {review.map((q, qi) => (
            <motion.div
              key={qi}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: qi * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-violet-100 text-violet-600 rounded-lg flex items-center justify-center font-bold text-sm">
                    Q{qi + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 pt-1">{q.text}</h3>
                </div>
              </div>

              <div className="p-6 grid gap-3">
                {q.options.map((opt, idx) => {
                  const isCorrect = idx === q.correctIndex;
                  const isSelected = idx === q.yourAnswer;
                  const isWrong = isSelected && !isCorrect;

                  let cardClass = "bg-white border-gray-200 text-gray-600";
                  let icon = null;

                  if (isCorrect) {
                    cardClass = "bg-green-50 border-green-200 text-green-800 font-medium";
                    icon = <span className="text-lg text-green-600">✓</span>;
                  } else if (isWrong) {
                    cardClass = "bg-red-50 border-red-200 text-red-800";
                    icon = <span className="text-lg text-red-600">✕</span>;
                  } else if (isSelected) {
                     // Should not happen if logic is correct (isSelected implies either correct or wrong)
                     // But handling just in case
                     cardClass = "bg-gray-100 border-gray-300";
                  }

                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-colors ${cardClass}`}
                    >
                      <span>{opt}</span>
                      {icon}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-8 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-all font-medium shadow-lg shadow-violet-200"
          >
            <span className="text-lg">🏠</span>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
