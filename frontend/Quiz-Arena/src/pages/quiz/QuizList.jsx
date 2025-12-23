import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api/axios";
import QuizCard from "../../components/QuizCard";

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await api.get("/quizzes/my");
        setQuizzes(res.data.quizzes);
      } catch (err) {
        console.error(err.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const filteredQuizzes = quizzes.filter(q => 
    q.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 text-violet-600">📚</span>
              My Library
            </h1>
            <p className="text-gray-500 mt-1">Manage and host your quizzes</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400">🔍</span>
              <input 
                type="text"
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none w-full md:w-64 transition-all"
              />
            </div>
            <button
              onClick={goToCreate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-medium shadow-sm hover:bg-violet-700 hover:shadow-md transition-all"
            >
              <span className="text-lg">➕</span>
              <span>Create Quiz</span>
            </button>
          </div>
        </div>

        {/* Grid */}
        {filteredQuizzes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Library className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No quizzes found</h3>
            <p className="text-gray-500 mt-1 mb-6">
              {searchTerm ? "Try a different search term" : "Create your first quiz to get started!"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => navigate("/quiz/create")}
                className="text-violet-600 font-medium hover:underline"
              >
                Create New Quiz
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz, idx) => (
              <motion.div
                key={quiz._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <QuizCard
                  quiz={quiz}
                  onHost={() => navigate(`/quiz/${quiz._id}/session/create`)}
                  // Add delete handler if API supports it
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
