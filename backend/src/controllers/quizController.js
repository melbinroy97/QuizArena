import Quiz from "../models/quiz.js";

/* =========================
   CREATE QUIZ
========================= */
export const createQuiz = async (req, res) => {
  try {
    const { title, description, duration } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Quiz title is required" });
    }

    const quiz = await Quiz.create({
      title,
      description,
      duration,
      createdBy: req.user._id,
      questions: [],
    });

    res.status(201).json({ quiz });
  } catch (err) {
    res.status(500).json({ message: "Failed to create quiz" });
  }
};

/* =========================
   GET MY QUIZZES
========================= */
export const getMyQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user._id });
    res.json({ quizzes });
  } catch {
    res.status(500).json({ message: "Failed to fetch quizzes" });
  }
};

/* =========================
   GET QUIZ BY ID
========================= */
export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Only creator can view full quiz
    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json({ quiz });
  } catch {
    res.status(500).json({ message: "Failed to fetch quiz" });
  }
};

/* =========================
   ADD QUESTION
========================= */
export const addQuestion = async (req, res) => {
  try {
    const { text, options, correctIndex } = req.body;
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    quiz.questions.push({ text, options, correctIndex });
    await quiz.save();

    res.json({ message: "Question added", quiz });
  } catch {
    res.status(500).json({ message: "Failed to add question" });
  }
};

/* =========================
   DELETE QUIZ
========================= */
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await quiz.deleteOne();
    res.json({ message: "Quiz deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete quiz" });
  }
};
