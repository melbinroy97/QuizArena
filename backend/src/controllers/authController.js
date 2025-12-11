import jwt from "jsonwebtoken";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

const sendToken = (user, res) => {
  const token = createToken(user._id);

  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    user: {
      id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      totalScore: user.totalScore,
      quizzesTaken: user.quizzesTaken,
    },
  });
};

// REGISTER
export const register = async (req, res) => {
  console.log("REGISTER ROUTE HIT");

  try {
    const { username, fullName, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already in use" });

    // Remove this line - let the model's pre-save hook handle hashing
    // const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      fullName,
      email,
      password, // Pass the plain password - the model will hash it
    });

    sendToken(user, res);
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: "Invalid credentials" });

    sendToken(user, res);
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET CURRENT USER
export const getMe = async (req, res) => {
  res.json({ user: req.user });
};

// LOGOUT
export const logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.json({ message: "Logged out" });
};
