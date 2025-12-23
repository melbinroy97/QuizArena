import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";
import { motion } from "framer-motion";
import { Brain, Target, CheckCircle, ArrowRight, RefreshCw, ShieldCheck } from "lucide-react";

export default function VerifyOtp() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const email = state?.email;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // 🚫 Direct access protection
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="bg-white p-8 rounded-xl text-center w-96">
          <p className="text-red-600 font-medium mb-4">
            Invalid access to OTP verification
          </p>
          <Link to="/register" className="text-blue-600 font-semibold">
            Go to Register
          </Link>
        </div>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/auth/verify-otp", { email, otp });
      setSuccess("Email verified successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setError("");
    setSuccess("");
    setResending(true);

    try {
      await api.post("/auth/resend-otp", { email });
      setSuccess("OTP resent successfully. Please check your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden bg-gray-50">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Floating Elements */}
      <motion.div
        animate={{ 
          y: [-20, 20, -20],
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-20 hidden lg:block text-violet-300/50"
      >
        <Brain size={64} />
      </motion.div>
      <motion.div
        animate={{ 
          y: [20, -20, 20],
          rotate: [0, -10, 10, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-20 hidden lg:block text-fuchsia-300/50"
      >
        <Target size={64} />
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="glass-card p-10 rounded-3xl w-full max-w-md mx-4 relative overflow-hidden border border-white/50 shadow-2xl hover:shadow-violet-500/10 transition-shadow duration-500"
      >
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-24 -right-24 w-64 h-64 bg-violet-200/40 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            rotate: [0, -90, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute -bottom-24 -left-24 w-64 h-64 bg-fuchsia-200/30 rounded-full blur-3xl" 
        />

        <div className="relative text-center mb-8">
          <motion.div
            variants={itemVariants}
            className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center shadow-inner"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <ShieldCheck className="w-8 h-8 text-violet-600" />
            </motion.div>
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">
            Verify Email
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-500">
            OTP sent to <span className="font-bold text-violet-600">{email}</span>
          </motion.p>
        </div>

        <form onSubmit={submit} className="space-y-6 relative z-10">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 text-red-500 p-4 rounded-xl flex items-center gap-3 text-sm border border-red-100 shadow-sm overflow-hidden"
            >
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-xs">!</span>
              </div>
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-green-50 text-green-600 p-4 rounded-xl flex items-center gap-3 text-sm border border-green-100 shadow-sm overflow-hidden"
            >
              <CheckCircle className="w-5 h-5" />
              {success}
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="flex justify-center">
            <input
              className="w-full text-center text-3xl tracking-[1em] font-bold py-4 bg-white/50 border border-gray-200 rounded-xl focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all duration-200 uppercase"
              placeholder="••••••"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
            />
          </motion.div>

          <motion.button 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-bold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              <>
                Verify OTP <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>

          <motion.button
            variants={itemVariants}
            type="button"
            onClick={resendOtp}
            disabled={resending}
            className="w-full py-2 text-sm text-violet-600 hover:text-violet-700 font-medium transition-colors flex items-center justify-center gap-2"
          >
            {resending ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-violet-600/30 border-t-violet-600 rounded-full"
              />
            ) : (
              <>
                <RefreshCw className="w-4 h-4" /> Resend OTP
              </>
            )}
          </motion.button>

          <motion.div variants={itemVariants} className="mt-4 text-center">
            <p className="text-gray-500 text-sm">
              Already verified?{" "}
              <Link to="/login" className="text-violet-600 font-bold hover:text-violet-700 transition-colors">
                Login
              </Link>
            </p>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
