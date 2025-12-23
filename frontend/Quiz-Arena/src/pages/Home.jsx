import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Zap, Users, Trophy, Brain, Target, Rocket } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden relative">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Hero Section */}
      <div className="relative pt-24 pb-32 lg:pt-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-48 -right-40 w-[820px] h-[820px] bg-violet-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-80 animate-blob"></div>
          <div className="absolute top-40 -left-40 w-[820px] h-[820px] bg-fuchsia-200/35 rounded-full mix-blend-multiply filter blur-3xl opacity-80 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Floating Elements */}
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-10 hidden lg:block text-violet-300"
          >
            <Brain size={48} />
          </motion.div>
          <motion.div
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-10 hidden lg:block text-fuchsia-300"
          >
            <Target size={48} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ 
                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
              }}
              className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-xl mb-8"
            >
              <Sparkles className="w-8 h-8 text-fuchsia-500" />
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 leading-tight">
              The Ultimate
              <br />
              <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
                Quiz Experience
              </span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
              Create, host, and compete in real-time quizzes. Join thousands of players in the
              arena of knowledge and turn every question into a challenge.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="group relative px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <span className="relative flex items-center gap-2">
                  Start for Free <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link
                to="/session/join"
                className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:border-violet-200 hover:-translate-y-1 transition-all duration-200 flex items-center gap-2"
              >
                Join Session
              </Link>
            </div>
          </motion.div>

          {/* Feature Cards */}
          <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8 text-yellow-500" />,
                bg: "bg-yellow-50",
                title: "Real-time Action",
                desc: "Experience synchronous gameplay with live leaderboards and instant feedback."
              },
              {
                icon: <Users className="w-8 h-8 text-blue-500" />,
                bg: "bg-blue-50",
                title: "Multiplayer Chaos",
                desc: "Host sessions for classrooms, teams, or friends and watch the chaos unfold."
              },
              {
                icon: <Trophy className="w-8 h-8 text-violet-500" />,
                bg: "bg-violet-50",
                title: "Compete to Win",
                desc: "Track your scores, climb the ranks, and prove your mastery over time."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 text-left group"
              >
                <div className={`${feature.bg} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
