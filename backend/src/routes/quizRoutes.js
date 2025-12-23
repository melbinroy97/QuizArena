import express from "express";
import {
  createQuiz,
  getMyQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
} from "../controllers/quizController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All quiz routes require login
router.post("/", protect, createQuiz);
router.get("/my", protect, getMyQuizzes);
router.get("/:quizId", protect, getQuizById);
router.put("/:quizId", protect, updateQuiz);
router.delete("/:quizId", protect, deleteQuiz);



export default router;
