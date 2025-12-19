import express from "express";
import {
  createQuiz,
  getMyQuizzes,
  getQuizById,
  addQuestion,
  deleteQuiz,
} from "../controllers/quizController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All quiz routes require login
router.post("/", protect, createQuiz);
router.get("/my", protect, getMyQuizzes);
router.get("/:id", protect, getQuizById);
router.post("/:id/questions", protect, addQuestion);
router.delete("/:id", protect, deleteQuiz);

export default router;
