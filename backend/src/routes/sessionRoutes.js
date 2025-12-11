import express from "express";
import { submitAnswer, nextQuestion, getCurrentQuestion, getLeaderboard } from "../controllers/sessionController.js";

import { protect } from "../middleware/authMiddleware.js";
import {
  createSession,
  joinSession,
  startSession,
  getSession,
} from "../controllers/sessionController.js";

const router = express.Router();

router.post("/create", protect, createSession);
router.post("/join", protect, joinSession);
router.post("/start", protect, startSession);
router.post("/:id/answer", protect, submitAnswer);
router.post("/:id/next", protect, nextQuestion);
router.get("/:id/current", protect, getCurrentQuestion);
router.get("/:id", protect, getSession);
router.get("/:id/leaderboard", protect, getLeaderboard);


export default router;
