import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";
import { motion } from "framer-motion";
import { Brain, Target, Lock, Key, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const email = state?.email;
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  if (!email) return <p>Invalid access</p>;

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword: password,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
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
              <Key className="w-8 h-8 text-violet-600" />
            </motion.div>
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">
            Reset Password
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-500">Enter your OTP and new password</motion.p>
        </div>

        <form onSubmit={submit} className="space-y-5 relative z-10">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 flex items-center gap-3 text-sm border border-red-100 shadow-sm overflow-hidden"
            >
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-xs">!</span>
              </div>
              {error}
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="relative group">
            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
            <input
              className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all duration-200"
              placeholder="Enter OTP"
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </motion.div>

          <motion.div variants={itemVariants} className="relative group">
            <Key className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
            <input
              type={showPassword ? "text" : "password"}
              className="w-full pl-12 pr-12 py-3 bg-white/50 border border-gray-200 rounded-xl focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all duration-200"
              placeholder="New Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-gray-400 hover:text-violet-500 transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </motion.div>

          <motion.button 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-bold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 flex items-center justify-center gap-2"
          >
            Reset Password <ArrowRight className="w-5 h-5" />
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
