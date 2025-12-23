import Quiz from "../models/quiz.js";

/* =====================================================
   CREATE QUIZ
===================================================== */
export const createQuiz = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({
        message: "Title and at least one question are required",
      });
    }

    // Validate questions
    for (const q of questions) {
      if (
        !q.text ||
        !q.options ||
        q.options.length < 2 ||
        q.correctIndex === undefined
      ) {
        return res.status(400).json({
          message: "Each question must have text, at least 2 options and a correct index",
        });
      }
    }

    const quiz = await Quiz.create({
      title,
      description,
      questions,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      quiz,
    });
  } catch (err) {
    console.error("CREATE QUIZ ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   GET MY QUIZZES
===================================================== */
export const getMyQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      quizzes,
    });
  } catch (err) {
    console.error("GET MY QUIZZES ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   GET SINGLE QUIZ
===================================================== */
export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({
      success: true,
      quiz,
    });
  } catch (err) {
    console.error("GET QUIZ ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   UPDATE QUIZ
===================================================== */
export const updateQuiz = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    quiz.title = title ?? quiz.title;
    quiz.description = description ?? quiz.description;
    quiz.questions = questions ?? quiz.questions;

    await quiz.save();

    res.json({
      success: true,
      quiz,
    });
  } catch (err) {
    console.error("UPDATE QUIZ ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   DELETE QUIZ
===================================================== */
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    await quiz.deleteOne();

    res.json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (err) {
    console.error("DELETE QUIZ ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
