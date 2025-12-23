import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import HostLobby from "./pages/session/HostLobby";
import PlayerLobby from "./pages/session/PlayerLobby";
import HostQuiz from "./pages/session/HostQuiz";
import PlayerQuiz from "./pages/session/PlayerQuiz";
import CreateSession from "./pages/quiz/CreateSession";
import QuizList from "./pages/quiz/QuizList";
import JoinQuiz from "./pages/session/JoinQuiz";
import Leaderboard from "./pages/session/Leaderboard";
import FinalLeaderboard from "./pages/session/FinalLeaderboard";
import ReviewQuiz from "./pages/session/ReviewQuiz";
import CreateQuiz from "./pages/quiz/CreateQuiz";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";

function App() {
  return (
    <>
      <Navbar />

      {/* offset for fixed navbar */}
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/host/lobby/:sessionId" element={<HostLobby />} />
          <Route path="/host/quiz/:sessionId" element={<HostQuiz />} />
          <Route path="/player/lobby/:sessionId" element={<PlayerLobby />} />
          <Route path="/player/quiz/:sessionId" element={<PlayerQuiz />} />
          
          <Route path="/quiz/list" element={<QuizList />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          {/* Legacy path support: redirect old /create-quiz URL */}
          <Route path="/create-quiz" element={<Navigate to="/quiz/create" replace />} />
          
          {/* join route (add this) */}
      <Route
        path="/quiz/join"
        element={
          <ProtectedRoute>
            <JoinQuiz />
          </ProtectedRoute>
        }
      />

            <Route path="/quiz/create" element={<CreateQuiz />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          <Route path="/quiz/:quizId/session/create" element={<CreateSession />} />


          <Route
          path="/session/join"
          element={
            <ProtectedRoute>
              <JoinQuiz />
            </ProtectedRoute>
          }
        />

          
          <Route
        path="/session/:sessionId/leaderboard"
        element={
          <ProtectedRoute>
            <Leaderboard />
          </ProtectedRoute>
        }
      />

          <Route
          path="/player/leaderboard/:sessionId"
          element={<FinalLeaderboard />}
        />

        <Route
          path="/host/leaderboard/:sessionId"
          element={<FinalLeaderboard />}
        />

        
        <Route
        path="/player/leaderboard/:sessionId"
        element={
          <ProtectedRoute>
            <Leaderboard />
          </ProtectedRoute>
        }
      />

        <Route
          path="/player/review/:sessionId"
          element={<ReviewQuiz />}
        />


      <Route
        path="/host/leaderboard/:sessionId"
        element={
          <ProtectedRoute>
            <Leaderboard />
          </ProtectedRoute>
        }
      />


          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      <Footer />
    </>
  );
}

export default App;
