import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },

  options: {
    type: [String],
    validate: [
      arr => arr.length >= 2,
      "At least 2 options are required"
    ],
  },

  correctIndex: {
    type: Number,
    required: true,
    validate: {
      validator: function (value) {
        return value >= 0 && value < this.options.length;
      },
      message: "correctIndex must match an option index",
    },
  },
  timeLimit: {
    type: Number,
    default: 30 // seconds
  }
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
