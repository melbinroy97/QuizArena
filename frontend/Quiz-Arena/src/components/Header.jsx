import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Show hero section ONLY on landing page
  const isHomePage = location.pathname === "/";

  return (
    <div
      className={`relative w-full bg-cover bg-center text-white ${
        isHomePage ? "min-h-screen" : ""
      }`}
      style={{ backgroundImage: isHomePage ? "url('/bg.svg')" : "none" }}
    >
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow-sm p-4 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          
          {/* Logo */}
          <Link to="/" aria-label="logo" className="flex items-center">
            <img
              src="/logo1.png"
              alt="Logo"
              className="h-16 w-auto object-contain"
            />
          </Link>

          {/* Menu */}
          <div className="hidden lg:flex items-center gap-6">
            <ul className="flex gap-6 text-gray-700">
              <li className="hover:text-blue-600 cursor-pointer">Payments</li>
              <li className="hover:text-blue-600 cursor-pointer">Banking+</li>
              <li className="hover:text-blue-600 cursor-pointer">Payroll</li>
              <li className="hover:text-blue-600 cursor-pointer">Engage</li>
              <li className="hover:text-blue-600 cursor-pointer">Partners</li>
              <li className="hover:text-blue-600 cursor-pointer">Resources</li>
              <li className="hover:text-blue-600 cursor-pointer">Pricing</li>
            </ul>

            {/* Right Buttons */}
            <div className="flex items-center gap-4">
              {/* Auth Buttons */}
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="border border-blue-500 text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition"
                  >
                    Sign Up
                    <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION — ONLY ON HOME PAGE */}
      {isHomePage && (
        <div className="pt-40 pb-20 flex flex-col items-center text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#f5e9e0] leading-relaxed">
            Welcome to Quizz Arena
          </h1>

          <p className="mt-6 text-lg md:text-xl text-[#f5e9e0]">
            Bridge classroom realities and curriculum expectations with the
            platform that’s AI-supported, but teacher-first.
          </p>

          {/* HERO BUTTONS */}
          <div className="flex flex-col md:flex-row gap-6 mt-12">
            <Link
              to="/register"
              className="bg-blue-900 text-white px-10 py-5 rounded-xl shadow-lg text-left hover:bg-blue-800 transition"
            >
              <p className="text-xs font-semibold tracking-wide">NEW USERS</p>
              <p className="text-xl font-semibold">Sign up now</p>
            </Link>

            <Link
              to="/login"
              className="bg-[#f9f3df] text-[#3a0c24] px-10 py-5 rounded-xl shadow-lg text-left hover:bg-[#f2e9d2] transition"
            >
              <p className="text-xs font-semibold tracking-wide">
                EXISTING USERS
              </p>
              <p className="text-xl font-semibold">Log in to continue</p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
