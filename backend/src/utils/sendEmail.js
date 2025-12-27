import nodemailer from "nodemailer";


// debug whether env vars are present (DO NOT log the secret value)
console.log("DEBUG: EMAIL_USER:", !!process.env.EMAIL_USER, "EMAIL_PASS set:", !!process.env.EMAIL_PASS);
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // Try port 587 (STARTTLS) instead of 465
  secure: false, // Must be false for port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // CRITICAL FIXES FOR TIMEOUTS:
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false, // Helps if the server certificate is acting up
  },
  // Force IPv4. Node sometimes defaults to IPv6 which fails in some containers
  family: 4, 
  
  connectionTimeout: 10000, 
  greetingTimeout: 10000,
});

export const sendOtpEmail = async (email, otp) => {
  console.log("Attempting to send email to:", email);
  try {
    // Verify connection configuration before sending
    await transporter.verify();
    
    await transporter.sendMail({
      from: `"QuizzArena" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your QuizzArena account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">Email Verification</h2>
          <p>Your OTP code for QuizzArena is:</p>
          <h1 style="color: #4c1d95; letter-spacing: 5px; background: #f3f4f6; padding: 10px; display: inline-block; border-radius: 8px;">${otp}</h1>
          <p>This code expires in 10 minutes.</p>
        </div>
      `,
    });
    console.log("✅ Email sent successfully");
  } catch (err) {
    console.error("❌ OTP EMAIL ERROR:", err.message);
    // Log the full error object to see if it's an Auth error or Network error
    console.error(err); 
    throw new Error("Failed to send OTP email");
  }
};
