import QuizSession from "../models/quizzSession.js";
import Quiz from "../models/quiz.js";

// Helper to generate a 6-digit join code
const generateJoinCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// CREATE SESSION
export const createSession = async (req, res) => {
  try {
    const { quizId } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const joinCode = generateJoinCode();

    const session = await QuizSession.create({
      quiz: quizId,
      host: req.user._id,
      joinCode,
    });

    res.status(201).json({ success: true, session });
  } catch (err) {
    console.error("CREATE SESSION ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// JOIN SESSION
export const joinSession = async (req, res) => {
  try {
    const { joinCode } = req.body;

    const session = await QuizSession.findOne({ joinCode });
    if (!session) return res.status(404).json({ message: "Invalid join code" });

    // Prevent duplicate joining
    const alreadyJoined = session.participants.some(
      (p) => p.user.toString() === req.user._id.toString()
    );
    if (alreadyJoined)
      return res.status(400).json({ message: "Already in session" });

    session.participants.push({ user: req.user._id });
    await session.save();

    res.json({ success: true, session });
  } catch (err) {
    console.error("JOIN SESSION ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// START SESSION
export const startSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await QuizSession.findById(sessionId);

    if (!session) return res.status(404).json({ message: "Session not found" });
    if (session.host.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Only host can start quiz" });

    session.status = "live";
    session.currentQuestionIndex = 0;
    await session.save();

    res.json({ success: true, session });
  } catch (err) {
    console.error("START SESSION ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET SESSION DETAILS
export const getSession = async (req, res) => {
  try {
    const session = await QuizSession.findById(req.params.id).populate(
      "participants.user",
      "username fullName email"
    );

    if (!session) return res.status(404).json({ message: "Session not found" });

    res.json({ success: true, session });
  } catch (err) {
    console.error("GET SESSION ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// SUBMIT ANSWER
export const submitAnswer = async (req, res) => {
  try {
    const { id } = req.params;             // session id
    const { selectedOption } = req.body;

    const session = await QuizSession.findById(id).populate("quiz");
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.status !== "live") {
      return res.status(400).json({ message: "Quiz is not live" });
    }

    const qIndex = session.currentQuestionIndex;
    const quiz = session.quiz;

    if (qIndex < 0 || qIndex >= quiz.questions.length) {
      return res.status(400).json({ message: "Invalid question index" });
    }

    const question = quiz.questions[qIndex];

    const isCorrect = question.correctIndex === selectedOption;

    // find participant
    const participant = session.participants.find(
      (p) => p.user.toString() === req.user._id.toString()
    );
    if (!participant) {
      return res.status(400).json({ message: "You are not in this session" });
    }

    // prevent answering same question multiple times
    const alreadyAnswered = participant.answers.some(
      (a) => a.questionIndex === qIndex
    );
    if (alreadyAnswered) {
      return res.status(400).json({ message: "Already answered this question" });
    }

    participant.answers.push({ questionIndex: qIndex, selectedOption, isCorrect });
    if (isCorrect) participant.score += 1; // 1 point per correct

    await session.save();

    res.json({ success: true, correct: isCorrect, score: participant.score });
  } catch (err) {
    console.error("SUBMIT ANSWER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// HOST: GO TO NEXT QUESTION
export const nextQuestion = async (req, res) => {
  try {
    const { id } = req.params; // session id

    const session = await QuizSession.findById(id).populate("quiz");
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only host can change questions" });
    }

    const quiz = session.quiz;
    if (!quiz) return res.status(500).json({ message: "Quiz not loaded" });

    // move to next
    if (session.currentQuestionIndex + 1 >= quiz.questions.length) {
      session.status = "ended";
      await session.save();
      return res.json({ success: true, status: "ended" });
    }

    session.currentQuestionIndex += 1;
    await session.save();

    res.json({
      success: true,
      currentQuestionIndex: session.currentQuestionIndex,
    });
  } catch (err) {
    console.error("NEXT QUESTION ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// GET CURRENT QUESTION (without correctIndex)
export const getCurrentQuestion = async (req, res) => {
  try {
    const { id } = req.params; // session id

    const session = await QuizSession.findById(id).populate("quiz");
    if (!session) return res.status(404).json({ message: "Session not found" });

    const qIndex = session.currentQuestionIndex;
    const quiz = session.quiz;

    if (session.status !== "live") {
      return res.json({ success: true, status: session.status, question: null });
    }

    if (qIndex < 0 || qIndex >= quiz.questions.length) {
      return res.json({ success: true, status: session.status, question: null });
    }

    const question = quiz.questions[qIndex];

    // send question without correctIndex
    const { text, options } = question;

    res.json({
      success: true,
      status: session.status,
      currentQuestionIndex: qIndex,
      question: { text, options },
    });
  } catch (err) {
    console.error("GET CURRENT QUESTION ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// LEADERBOARD
export const getLeaderboard = async (req, res) => {
  try {
    const { id } = req.params; // session id

    const session = await QuizSession.findById(id)
      .populate("participants.user", "username fullName");
    if (!session) return res.status(404).json({ message: "Session not found" });

    const leaderboard = session.participants
      .map((p) => ({
        userId: p.user._id,
        username: p.user.username,
        fullName: p.user.fullName,
        score: p.score,
      }))
      .sort((a, b) => b.score - a.score);

    res.json({ success: true, leaderboard });
  } catch (err) {
    console.error("LEADERBOARD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
