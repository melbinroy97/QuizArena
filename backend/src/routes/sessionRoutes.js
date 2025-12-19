import express from "express";
import { createSession, joinSession, startSession, getCurrentQuestion, submitAnswer, nextQuestion, getLeaderboard, getSessionState, getQuizReview} from "../controllers/sessionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================
   SESSION ROUTES
========================= */
router.post("/", protect, createSession); 
router.post("/create", protect, createSession);
router.post("/join", protect, joinSession);
router.post("/:sessionId/start", protect, startSession);
router.get("/:sessionId/question", protect, getCurrentQuestion);
router.post(
  "/:sessionId/answer",
  protect,
  submitAnswer
);

router.post("/:sessionId/next", protect, nextQuestion);
router.get("/:sessionId/leaderboard", protect, getLeaderboard);
router.get("/:sessionId/state", protect, getSessionState);



router.get(
  "/:sessionId/review",
  protect,
  getQuizReview
);


export default router;
