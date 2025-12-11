import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorHandler from './middleware/errorHandler.js';
import quizRoutes from "./routes/quizRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use('/api/auth', authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/sessions", sessionRoutes);

app.get('/', (req, res) => {
  res.send("QuizzArena API running");
});

// must be LAST
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
