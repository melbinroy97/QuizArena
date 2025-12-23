import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, LogOut, User, Settings, ChevronDown, Trophy } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2.5 bg-blue-600 rounded-xl group-hover:scale-105 transition-transform shadow-lg shadow-blue-500/20">
              <Trophy className="text-amber-400 w-6 h-6 fill-current" />
            </div>
            <div className="text-2xl font-extrabold tracking-tight">
              <span className="text-blue-600">Quiz</span>
              <span className="text-amber-400">Arena</span>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            {!user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-black text-white hover:bg-gray-800 rounded-xl font-bold transition-all transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link 
                  to="/dashboard" 
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive('/dashboard') 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <LayoutDashboard size={20} />
                  <span className="font-medium">Dashboard</span>
                </Link>

                <Link 
                  to="/quiz/create" 
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive('/quiz/create') 
                      ? 'bg-purple-50 text-purple-600 border border-purple-200' 
                      : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <span>➕</span>
                  <span className="font-medium">Create</span>
                </Link>

                <div className="h-8 w-px bg-gray-200 mx-2"></div>

                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 group cursor-pointer focus:outline-none"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-purple-500/20 transition-all group-hover:scale-105 border-2 border-white overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        user.username ? user.username[0].toUpperCase() : "?"
                      )}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                        {user.username}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 group-hover:text-gray-400">
                        <span>View Profile</span>
                        <ChevronDown size={12} />
                      </div>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-100 mb-2">
                          <p className="text-sm font-bold text-gray-900">Signed in as</p>
                          <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        </div>

                        <Link 
                          to="/profile" 
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-violet-600 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User size={16} />
                          Your Profile
                        </Link>

                        <Link 
                          to="/profile/edit" 
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-violet-600 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings size={16} />
                          Edit Profile
                        </Link>

                        <div className="border-t border-gray-100 my-2"></div>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}