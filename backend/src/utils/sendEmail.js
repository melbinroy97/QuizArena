import nodemailer from "nodemailer";


// debug whether env vars are present (DO NOT log the secret value)
console.log("DEBUG: EMAIL_USER:", !!process.env.EMAIL_USER, "EMAIL_PASS set:", !!process.env.EMAIL_PASS);
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpEmail = async (email, otp) => {
  console.log("Attempting to send email to:", email);
  try {
    await transporter.verify();
    await transporter.sendMail({
      from: `"QuizzArena" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your QuizzArena account",
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This code expires in 10 minutes.</p>
      `,
    });
    console.log("✅ Email sent successfully");
  } catch (err) {
    console.error("❌ OTP EMAIL ERROR:", err.message);
    throw new Error("Failed to send OTP email");
  }
};
