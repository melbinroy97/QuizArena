import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  score: {
    type: Number,
    default: 0,
  },

  answers: [
    {
      questionIndex: Number,
      selectedOption: Number,
      isCorrect: Boolean,
      answeredAt: Date,
    },
  ],

  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

const quizSessionSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    joinCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["waiting", "live", "ended"],
      default: "waiting",
    },

    participants: {
      type: [participantSchema],
      default: [],
    },

    currentQuestionIndex: {
      type: Number,
      default: -1,
    },

    /* =========================
       QUESTION TIMER (NEW)
    ========================= */
    currentQuestionStartedAt: Date,
    currentQuestionEndsAt: Date,

    startedAt: Date,
    endedAt: Date,

    allowAnswers: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const QuizSession = mongoose.model("QuizSession", quizSessionSchema);

export default QuizSession;
