import Quiz from "../models/quiz.js";

export const createQuiz = async (req, res) => {
  try {
    const { title, description, duration, questions } = req.body;

    if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Title and at least one question are required" });
    }

    const quiz = await Quiz.create({
      title,
      description,
      duration,
      questions,
      createdBy: req.user._id, // from protect middleware
    });

    res.status(201).json({ success: true, quiz });
  } catch (err) {
    console.error("CREATE QUIZ ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user._id }).sort("-createdAt");
    res.json({ success: true, quizzes });
  } catch (err) {
    console.error("GET MY QUIZZES ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json({ success: true, quiz });
  } catch (err) {
    console.error("GET QUIZ ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
