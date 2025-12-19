import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    fullName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    /* =========================
       EMAIL VERIFICATION
    ========================= */
    isVerified: {
      type: Boolean,
      default: false,
    },

    emailOtp: {
      type: String,
    },

    emailOtpExpires: {
      type: Date,
    },

    /* =========================
       FORGOT PASSWORD
    ========================= */
    resetOtp: {
      type: String,
    },

    resetOtpExpires: {
      type: Date,
    },

    /* =========================
       USER META
    ========================= */
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    totalScore: {
      type: Number,
      default: 0,
    },

    quizzesTaken: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

/* =========================
   HASH PASSWORD
========================= */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

/* =========================
   MATCH PASSWORD
========================= */
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
