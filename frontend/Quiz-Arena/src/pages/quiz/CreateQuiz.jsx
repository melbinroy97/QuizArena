import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Save } from "lucide-react";
import api from "../../api/axios";

export default function CreateQuiz() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  // Initialize with one empty question
  const [questions, setQuestions] = useState([
    {
      text: "",
      options: ["", ""],
      correctIndex: 0,
      timeLimit: 30,
    }
  ]);

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const addOption = (qIndex) => {
    const newQuestions = [...questions];
    if (newQuestions[qIndex].options.length >= 6) return;
    newQuestions[qIndex].options.push("");
    setQuestions(newQuestions);
  };

  const removeOption = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    if (newQuestions[qIndex].options.length <= 2) return;
    
    newQuestions[qIndex].options.splice(oIndex, 1);
    
    // Adjust correctIndex if needed
    if (newQuestions[qIndex].correctIndex === oIndex) {
      newQuestions[qIndex].correctIndex = 0;
    } else if (newQuestions[qIndex].correctIndex > oIndex) {
      newQuestions[qIndex].correctIndex--;
    }
    
    setQuestions(newQuestions);
  };

  const setCorrectOption = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctIndex = oIndex;
    setQuestions(newQuestions);
  };

  const addNewQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        options: ["", ""],
        correctIndex: 0,
        timeLimit: 30,
      }
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const createQuiz = async () => {
    if (!title.trim()) {
      alert("Quiz title is required");
      return;
    }

    // Validate all questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        alert(`Question ${i + 1} text is required`);
        return;
      }
      if (q.options.some(o => !o.trim())) {
        alert(`All options for Question ${i + 1} are required`);
        return;
      }
    }

    try {
      await api.post("/quizzes", {
        title,
        description,
        questions,
      });

      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data);
      alert("Quiz creation failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-32 px-4 sm:px-6">
      <div className="flex items-center gap-4 mb-8 pt-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <span className="text-2xl text-gray-600">←</span>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Quiz</h1>
          <p className="text-gray-500">Craft your questions and challenge your friends.</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Quiz Details Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title</label>
              <input
                className="input-field text-lg font-medium w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                placeholder="e.g. World History Trivia"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                className="input-field min-h-[100px] resize-none w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                placeholder="What is this quiz about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {questions.map((q, qIndex) => (
              <motion.div
                key={qIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Card Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="text-lg font-bold text-gray-700">Question {qIndex + 1}</h3>
                  {questions.length > 1 && (
                    <button
                      onClick={() => removeQuestion(qIndex)}
                      className="flex items-center gap-2 text-red-400 hover:text-red-600 transition-colors text-sm font-medium"
                    >
                      <span>🗑</span>
                      Remove
                    </button>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-8 space-y-8">
                  {/* Question Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
                    <input
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                      placeholder="Type your question here..."
                      value={q.text}
                      onChange={(e) => handleQuestionChange(qIndex, "text", e.target.value)}
                    />
                  </div>

                  {/* Answer Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Answer Options</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {q.options.map((opt, oIndex) => (
                        <div 
                          key={oIndex} 
                          className={`relative flex items-center group transition-all duration-200 rounded-xl border-2 ${
                            q.correctIndex === oIndex 
                              ? "border-green-400 bg-green-50/30" 
                              : "border-gray-100 hover:border-gray-200 bg-white"
                          }`}
                        >
                          <input
                            className="flex-1 bg-transparent px-4 py-3 outline-none text-gray-700 placeholder-gray-400"
                            placeholder={`Option ${oIndex + 1}`}
                            value={opt}
                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                          />
                          
                          <div className="flex items-center pr-3 gap-2">
                            {/* Remove Option Button (only if > 2 options) */}
                            {q.options.length > 2 && (
                              <button
                                onClick={() => removeOption(qIndex, oIndex)}
                                className="p-1.5 text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                title="Remove option"
                              >
                                ✕
                              </button>
                            )}
                            
                            {/* Correct Answer Toggle */}
                            <button
                              onClick={() => setCorrectOption(qIndex, oIndex)}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                q.correctIndex === oIndex
                                  ? "border-green-500 bg-green-500 text-white"
                                  : "border-gray-300 text-transparent hover:border-gray-400"
                              }`}
                              title="Mark as correct answer"
                            >
                              <span className="text-xs font-bold">✓</span>
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {/* Add Option Button */}
                      {q.options.length < 6 && (
                        <button
                          onClick={() => addOption(qIndex)}
                          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50 transition-all font-medium"
                        >
                          <span className="text-lg">+</span>
                          Add Option
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Time Limit */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium text-gray-700">Time Limit (s)</label>
                      <input
                        type="number"
                        min="5"
                        max="300"
                        value={q.timeLimit}
                        onChange={(e) => handleQuestionChange(qIndex, "timeLimit", Number(e.target.value))}
                        className="w-24 px-3 py-2 rounded-lg border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all text-center font-medium"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add Another Question Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={addNewQuestion}
            className="w-full py-6 rounded-2xl border-2 border-dashed border-violet-300 text-violet-600 font-bold text-lg hover:bg-violet-50 hover:border-violet-400 transition-all flex items-center justify-center gap-2"
          >
            <span className="text-2xl">+</span>
            Add Another Question
          </motion.button>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto flex justify-end gap-4">
          <button 
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={createQuiz}
            className="px-8 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-bold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transition-all flex items-center gap-2"
          >
            <Save size={20} />
            Save Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
