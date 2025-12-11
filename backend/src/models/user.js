// ...existing code...
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    fullName: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    totalScore: { type: Number, default: 0 },
    quizzesTaken: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Hash password before save — async middleware WITHOUT calling next()
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

// Password comparison
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Remove sensitive fields when converting to JSON
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);
export default User;
// ...existing