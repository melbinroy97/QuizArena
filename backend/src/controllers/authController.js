import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.js";
import { sendOtpEmail } from "../utils/sendEmail.js";

/* =========================
   JWT HELPERS
========================= */
const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

const sendToken = (user, res) => {
  const token = createToken(user._id);

  res.cookie('jwt', token, {
  httpOnly: true,
  secure: true,            // ⚠️ CRITICAL: Must be true on Render (HTTPS)
  sameSite: 'none',        // ⚠️ CRITICAL: Must be 'none' for cross-domain
  maxAge: 24 * 60 * 60 * 1000 // 1 day
});

  res.json({
    success: true,
    user: {
      id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
};

/* =========================
   REGISTER
========================= */
export const register = async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    await User.create({
      username,
      fullName,
      email,
      password,
      isVerified: false,
      emailOtp: hashedOtp,
      emailOtpExpires: Date.now() + 10 * 60 * 1000,
    });

    await sendOtpEmail(email, otp);

    res.status(201).json({
      success: true,
      message: "OTP sent to email",
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   VERIFY EMAIL OTP
========================= */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Missing email or OTP" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not registered" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    if (
      user.emailOtp !== hashedOtp ||
      !user.emailOtpExpires ||
      user.emailOtpExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.emailOtp = undefined;
    user.emailOtpExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Email verified successfully. Please login.",
    });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   RESEND EMAIL OTP
========================= */
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not registered" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.emailOtp = crypto.createHash("sha256").update(otp).digest("hex");
    user.emailOtpExpires = Date.now() + 10 * 60 * 1000;

    await user.save();
    await sendOtpEmail(email, otp);

    res.json({ success: true, message: "OTP resent successfully" });
  } catch (err) {
    console.error("RESEND OTP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   LOGIN
========================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Email is not registered" });
    }

    const match = await user.matchPassword(password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 🔥 FIX STARTS HERE
    if (!user.isVerified) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      user.emailOtp = crypto.createHash("sha256").update(otp).digest("hex");
      user.emailOtpExpires = Date.now() + 10 * 60 * 1000;

      await user.save();
      await sendOtpEmail(user.email, otp);

      return res.status(403).json({
        message: "Email not verified. OTP sent again.",
      });
    }
    // 🔥 FIX ENDS HERE

    sendToken(user, res);
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/* =========================
   GET ME
========================= */
export const getMe = (req, res) => {
  res.json({ user: req.user });
};

/* =========================
   LOGOUT
========================= */
export const logout = (req, res) => {
  res.cookie("jwt", "", { 
    httpOnly: true, 
    secure: true,       // Add this
    sameSite: "none",   // Add this
    expires: new Date(0) 
  });
  res.json({ message: "Logged out" });
};

/* =========================
   FORGOT PASSWORD - SEND OTP
========================= */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = crypto.createHash("sha256").update(otp).digest("hex");
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000;

    await user.save();
    await sendOtpEmail(email, otp);

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   RESET PASSWORD
========================= */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not registered" });
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    if (
      user.resetOtp !== hashedOtp ||
      !user.resetOtpExpires ||
      user.resetOtpExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = newPassword;
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;

    await user.save();

    res.json({ message: "Password reset successful. Please login." });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   UPDATE PROFILE
========================= */
export const updateProfile = async (req, res) => {
  try {
    const { username, fullName, bio, password, avatar } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return res.status(400).json({ message: "Username already taken" });
      }
      user.username = username;
    }

    if (fullName !== undefined) user.fullName = fullName;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;
    if (password) user.password = password; // Will be hashed by pre-save hook

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
      },
    });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

