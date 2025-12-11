import express from "express";
import { createQuiz, getMyQuizzes, getQuizById } from "../controllers/quizController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// logged-in user can create quiz
router.post("/", protect, createQuiz);

// get all quizzes created by current user
router.get("/my", protect, getMyQuizzes);

// get a single quiz by id
router.get("/:id", protect, getQuizById);

export default router;
