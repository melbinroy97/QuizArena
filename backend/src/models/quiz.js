import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{ type: String, required: true }], // at least 2 options in frontend
  correctIndex: { type: Number, required: true },
});

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    duration: { type: Number, default: 60 }, // in seconds or minutes as you decide
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    questions: [questionSchema],
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
