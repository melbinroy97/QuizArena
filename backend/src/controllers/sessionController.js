import Quiz from "../models/quiz.js";
import QuizSession from "../models/quizzSession.js";
import generateCode from "../utils/generateCode.js";

/* =====================================================
   CREATE QUIZ SESSION (HOST)
===================================================== */
export const createSession = async (req, res) => {
  try {
    const { quizId } = req.body;

    if (!quizId) {
      return res.status(400).json({ message: "Quiz ID is required" });
    }

    const quiz = await Quiz.findOne({
      _id: quizId,
      createdBy: req.user._id,
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    let joinCode;
    let exists = true;

    while (exists) {
      joinCode = generateCode(6);
      exists = await QuizSession.findOne({ joinCode });
    }

    const session = await QuizSession.create({
      quiz: quiz._id,
      host: req.user._id,
      joinCode,
      status: "waiting",
      participants: [],
    });

    res.status(201).json({
      success: true,
      sessionId: session._id,
      joinCode: session.joinCode,
      status: session.status,
    });
  } catch (err) {
    console.error("CREATE SESSION ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   JOIN QUIZ SESSION (PLAYER)
===================================================== */
export const joinSession = async (req, res) => {
  try {
    const { joinCode } = req.body;

    if (!joinCode) {
      return res.status(400).json({ message: "Join code is required" });
    }

    const session = await QuizSession.findOne({ joinCode });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.status !== "waiting") {
      return res.status(400).json({ message: "Quiz already started" });
    }

    if (session.host.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Host cannot join as player" });
    }

    const alreadyJoined = session.participants.some(
      (p) => p.user.toString() === req.user._id.toString()
    );

    if (alreadyJoined) {
      return res.status(400).json({ message: "Already joined session" });
    }

    session.participants.push({
      user: req.user._id,
      score: 0,
      answers: [],
    });

    await session.save();

    const io = req.app.get("io");
    io.to(session._id.toString()).emit("player-joined", {
      userId: req.user._id,
    });

    res.json({
      success: true,
      sessionId: session._id,
      message: "Joined session successfully",
    });
  } catch (err) {
    console.error("JOIN SESSION ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   START QUIZ SESSION (HOST)
===================================================== */
export const startSession = async (req, res) => {

  try {
    const session = await QuizSession.findById(req.params.sessionId)
      .populate("quiz");

      //Debug logs: inspecting session and quiz data
    console.log("QUIZ:", session.quiz);
    console.log("QUESTIONS:", session.quiz.questions);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only host can start quiz" });
    }

    if (!session.quiz.questions || session.quiz.questions.length === 0) {
      return res.status(400).json({
        message: "Quiz has no questions",
      });
    }

    session.status = "live";
    session.startedAt = new Date();
    session.currentQuestionIndex = 0;

    const question = session.quiz.questions[0];

    session.currentQuestionStartedAt = new Date();
    session.currentQuestionEndsAt = new Date(
      Date.now() + ((question.timeLimit ?? 30) * 1000)
    );
    session.allowAnswers = true;

    await session.save();

    const io = req.app.get("io");
    io.to(session._id.toString()).emit("quiz-started");

    res.json({ success: true });
  } catch (err) {
    console.error("START SESSION ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   SUBMIT ANSWER
===================================================== */
export const submitAnswer = async (req, res) => {
  try {
    const { selectedOption } = req.body;
    const userId = req.user._id;

    const session = await QuizSession.findById(req.params.sessionId)
      .populate("quiz");

    if (!session || session.status !== "live") {
      return res.status(400).json({ message: "Quiz not live" });
    }

    if (!session.allowAnswers) {
      return res.status(403).json({ message: "Answers locked" });
    }

    const qIndex = session.currentQuestionIndex;
    const question = session.quiz.questions[qIndex];

    const participant = session.participants.find(
      (p) => p.user.toString() === userId.toString()
    );

    if (!participant) {
      return res.status(403).json({ message: "Not a participant" });
    }

    const alreadyAnswered = participant.answers.some(
      (a) => a.questionIndex === qIndex
    );

    if (alreadyAnswered) {
      return res.status(400).json({ message: "Already answered" });
    }

    // Calculate remaining time
    const now = Date.now();
    const endsAt = new Date(session.currentQuestionEndsAt).getTime();

    const timeLeft = Math.max(
      0,
      Math.ceil((endsAt - now) / 1000)
    );

    // Calculate score (max 100)
    let score = 0;
    const isCorrect = selectedOption === question.correctIndex;
    if (isCorrect) {
      score = Math.ceil(
        (timeLeft / (question.timeLimit ?? 30)) * 100
      );
    }

    // Save response
    session.responses = session.responses || [];
    session.responses.push({
      user: req.user._id,
      questionIndex: session.currentQuestionIndex,
      selectedOption,
      isCorrect,
      score,
    });

    // update participant answers & score for leaderboard
    participant.answers.push({
      questionIndex: qIndex,
      selectedOption,
      isCorrect,
      answeredAt: new Date(),
    });
    participant.score = (participant.score || 0) + score;

    await session.save();

    const io = req.app.get("io");
    // Build leaderboard
    const leaderboard = session.participants
      .map((p) => ({
        userId: p.user.toString(),
        score: p.score,
      }))
      .sort((a, b) => b.score - a.score);

    // 🔥 Emit live leaderboard
    io.to(session._id.toString()).emit("leaderboard-update", leaderboard);

     // include correctIndex and score for frontend
    res.json({
      success: true,
      correct: isCorrect,
      correctIndex: question.correctIndex,
      score,
    });
  } catch (err) {
    console.error("SUBMIT ANSWER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   NEXT QUESTION (HOST)
===================================================== */
export const nextQuestion = async (req, res) => {
  try {
    const session = await QuizSession.findById(req.params.sessionId)
      .populate("quiz");

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only host allowed" });
    }

    const nextIndex = session.currentQuestionIndex + 1;

    if (nextIndex >= session.quiz.questions.length) {
      session.status = "ended";
      session.endedAt = new Date();
      session.allowAnswers = false;
      await session.save();

      const io = req.app.get("io");
      io.to(session._id.toString()).emit("quiz-ended");

      return res.json({ success: true, status: "ended" });
    }

    const question = session.quiz.questions[nextIndex];

    session.currentQuestionIndex = nextIndex;
    session.currentQuestionStartedAt = new Date();
    session.currentQuestionEndsAt = new Date(
      Date.now() + ((question.timeLimit ?? 30) * 1000)
    );
    session.allowAnswers = true;

    await session.save();

    const io = req.app.get("io");
    io.to(session._id.toString()).emit("next-question");

    res.json({ success: true });
  } catch (err) {
    console.error("NEXT QUESTION ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   GET CURRENT QUESTION
===================================================== */
export const getCurrentQuestion = async (req, res) => {
  try {
    const session = await QuizSession.findById(req.params.sessionId)
      .populate("quiz");

    if (!session || session.status !== "live") {
      return res.status(400).json({ message: "Quiz not live" });
    }

    const question = session.quiz.questions[session.currentQuestionIndex];

    if (!question) {
      return res.status(400).json({ message: "No active question" });
    }

    res.json({
      success: true,
      question: {
        index: session.currentQuestionIndex,
        text: question.text,
        options: question.options,
        endsAt: session.currentQuestionEndsAt,
      },
    });
  } catch (err) {
    console.error("GET CURRENT QUESTION ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   LEADERBOARD
===================================================== */
export const getLeaderboard = async (req, res) => {
  try {
    const session = await QuizSession.findById(req.params.sessionId)
      .populate("participants.user", "username fullName");

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const leaderboard = session.participants
      .map((p) => ({
        userId: p.user._id,
        username: p.user.username,
        fullName: p.user.fullName,
        score: p.score,
      }))
      .sort((a, b) => b.score - a.score);

    res.json({
      success: true,
      status: session.status,
      joinCode: session.joinCode,
      leaderboard,
    });
  } catch (err) {
    console.error("LEADERBOARD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};




/* =====================================================
   GET SESSION STATE (HOST + PLAYER)
===================================================== */
export const getSessionState = async (req, res) => {
  try {
    const session = await QuizSession.findById(req.params.sessionId)
      .populate("quiz")
      .populate("participants.user", "username fullName");

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    let question = null;

    if (
      session.status === "live" &&
      session.quiz.questions[session.currentQuestionIndex]
    ) {
      const q = session.quiz.questions[session.currentQuestionIndex];

      question = {
        index: session.currentQuestionIndex,
        text: q.text,
        options: q.options,
        endsAt: session.currentQuestionEndsAt,
      };
    }

    res.json({
      success: true,
      status: session.status,
      joinCode: session.joinCode,
      question,
      leaderboard: session.participants
        .map((p) => ({
          userId: p.user._id,
          username: p.user.username,
          score: p.score,
        }))
        .sort((a, b) => b.score - a.score),
    });
  } catch (err) {
    console.error("GET SESSION STATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};




/* =====================================================
   GET QUIZ REVIEW (PLAYER)
===================================================== */
export const getQuizReview = async (req, res) => {
  try {
    const session = await QuizSession.findById(req.params.sessionId)
      .populate("quiz")
      .populate("participants.user", "username fullName");

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.status !== "ended") {
      return res.status(400).json({ message: "Quiz not ended yet" });
    }

    const participant = session.participants.find(
      (p) => p.user._id.toString() === req.user._id.toString()
    );

    if (!participant) {
      return res.status(403).json({ message: "Not a participant" });
    }

    // Build answer review
    const review = session.quiz.questions.map((q, index) => {
      const ans = participant.answers.find(
        (a) => a.questionIndex === index
      );

      return {
        questionIndex: index,
        text: q.text,
        options: q.options,
        correctIndex: q.correctIndex,
        yourAnswer: ans ? ans.selectedOption : null,
        isCorrect: ans ? ans.isCorrect : false,
      };
    });

    // Leaderboard
    const leaderboard = session.participants
      .map((p) => ({
        userId: p.user._id,
        username: p.user.username,
        fullName: p.user.fullName,
        score: p.score,
      }))
      .sort((a, b) => b.score - a.score);

    res.json({
      success: true,
      review,
      leaderboard,
    });
  } catch (err) {
    console.error("GET QUIZ REVIEW ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};







/* =====================================================
   LEAVE QUIZ SESSION (PLAYER / HOST)
===================================================== */
export const leaveSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user._id;
    const userIdStr = userId.toString();

    const session = await QuizSession.findById(sessionId).populate(
      "participants.user",
      "username fullName"
    );

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const io = req.app.get("io");

    // If HOST leaves → end session and notify everyone
    if (session.host.toString() === userIdStr) {
      session.status = "ended";
      session.endedAt = new Date();
      session.allowAnswers = false;
      await session.save();

      // notify clients that quiz ended / host left
      io.to(session._id.toString()).emit("quiz-ended", {
        message: "Host ended the session",
        hostId: userIdStr,
      });
      io.to(session._id.toString()).emit("host-left", {
        hostId: userIdStr,
      });

      return res.json({
        success: true,
        message: "Host left. Session ended.",
        ended: true,
      });
    }

    // Find index of leaving participant (works whether populated or not)
    const idx = session.participants.findIndex((p) => {
      const pid =
        p.user && (p.user._id ? p.user._id.toString() : p.user.toString());
      return pid === userIdStr;
    });

    if (idx === -1) {
      return res.status(400).json({ message: "User not in session" });
    }

    // remove and capture leaving participant for username
    const [leaving] = session.participants.splice(idx, 1);
    await session.save();

    // build updated leaderboard / participant list to send to clients
    const leaderboard = session.participants
      .map((p) => ({
        userId:
          p.user && p.user._id ? p.user._id.toString() : p.user.toString(),
        username: p.user?.username || null,
        fullName: p.user?.fullName || null,
        score: p.score || 0,
      }))
      .sort((a, b) => b.score - a.score);

    // derive username robustly
    let username =
      leaving?.user?.username || leaving?.user?.fullName || req.user?.username;

    if (!username) {
      const u = await User.findById(userId).select("username fullName");
      username = u?.username || u?.fullName || "A player";
    }

    // notify host and remaining players
    io.to(session._id.toString()).emit("player-left", {
      userId: userIdStr,
      leaderboard,
      username,
      participantsCount: session.participants.length,
    });

    return res.json({
      success: true,
      message: "Left session successfully",
      leaderboard,
    });
  } catch (err) {
    console.error("LEAVE SESSION ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   GET PLAYED SESSIONS (HISTORY)
===================================================== */
export const getPlayedSessions = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find sessions where the user is a participant
    const sessions = await QuizSession.find({
      "participants.user": userId,
      status: "ended",
    })
      .populate("quiz", "title questions")
      .sort({ endedAt: -1 });

    const history = sessions.map((session) => {
      const participant = session.participants.find(
        (p) => p.user.toString() === userId.toString()
      );

      if (!participant) return null;

      const totalQuestions = session.quiz?.questions?.length || 0;
      const correctAnswers = participant.answers.filter((a) => a.isCorrect).length;
      const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

      return {
        sessionId: session._id,
        quizTitle: session.quiz?.title || "Unknown Quiz",
        playedAt: session.endedAt || session.updatedAt,
        score: participant.score,
        accuracy,
        totalQuestions,
        correctAnswers,
      };
    }).filter(Boolean);

    res.json({ success: true, history });
  } catch (err) {
    console.error("GET HISTORY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};