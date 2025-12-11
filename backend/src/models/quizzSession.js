import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  score: { type: Number, default: 0 },
  answers: [
    {
      questionIndex: Number,
      selectedOption: Number,
      isCorrect: Boolean
    }
  ]
});

const quizSessionSchema = new mongoose.Schema(
  {
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    joinCode: { type: String, required: true, unique: true },

    status: {
      type: String,
      enum: ["waiting", "live", "ended"],
      default: "waiting",
    },

    participants: [participantSchema],

    currentQuestionIndex: { type: Number, default: -1 }, // -1 = not started
  },
  { timestamps: true }
);

const QuizSession = mongoose.model("QuizSession", quizSessionSchema);

export default QuizSession;
