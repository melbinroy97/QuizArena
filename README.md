# QuizzArena 🎮

QuizzArena is a dynamic, real-time quiz platform designed for hosting and participating in interactive quiz competitions. Built with the MERN stack (MongoDB, Express, React, Node.js) and powered by Socket.io, it offers a seamless experience for quiz creators and players alike.

![QuizzArena Banner](https://placehold.co/1200x400/7c3aed/ffffff?text=QuizzArena)

## ✨ Features

### 🔐 Authentication & Security
- **Secure Sign Up/Login:** JWT-based authentication using httpOnly cookies.
- **Email Verification:** OTP-based email verification during registration.
- **Password Recovery:** Secure forgot/reset password flows.
- **Form Validation:** Robust client-side validation for all user inputs.

### 👤 User Experience
- **Profile Management:** Update user details and choose from generated avatars (powered by **DiceBear API**).
- **Responsive Design:** Fully responsive UI built with **Tailwind CSS**.
- **Smooth Animations:** Engaging transitions and effects using **Framer Motion**.

### 🧠 Quiz Management
- **Create Quizzes:** Intuitive interface for creating quizzes with multiple-choice questions.
- **Edit & Manage:** Update existing quizzes or delete them.
- **Question Timer:** Set time limits for questions.

### ⚡ Real-Time Game Sessions
- **Live Hosting:** Hosts can start sessions, generate unique join codes, and control the game flow.
- **Real-Time Multiplayer:** Players join instantly using a code.
- **Live Leaderboard:** Real-time score updates after every question.
- **Socket.io Integration:** Low-latency communication for a synchronized experience.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React (Vite)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **State/Networking:** Axios, Socket.io-client, React Router DOM

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Real-Time:** Socket.io
- **Auth:** JSON Web Tokens (JWT), Bcryptjs
- **Email:** Nodemailer

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/melbinroy97/QuizzArena.git
cd QuizzArena
```

### 2. Backend Setup
Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password
FRONTEND_URL=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend folder, and install dependencies:
```bash
cd frontend/Quiz-Arena
npm install
```

Create a `.env` file in the `frontend/Quiz-Arena` directory (optional if using default localhost):
```env
VITE_API_URL=http://localhost:8080
```

Start the frontend development server:
```bash
npm run dev
```

---

## 📂 Project Structure

```
QuizzArena/
├── backend/                 # Express Server & API
│   ├── src/
│   │   ├── config/          # DB Connection
│   │   ├── controllers/     # Route Logic
│   │   ├── middleware/      # Auth & Error Handling
│   │   ├── models/          # Mongoose Schemas
│   │   ├── routes/          # API Routes
│   │   ├── utils/           # Helpers (Email, Validation)
│   │   ├── app.js           # App Configuration
│   │   └── server.js        # Server Entry Point
│
├── frontend/Quiz-Arena/     # React Client
│   ├── src/
│   │   ├── api/             # Axios Setup
│   │   ├── components/      # Reusable UI Components
│   │   ├── context/         # Auth Context
│   │   ├── layout/          # Page Layouts
│   │   ├── pages/           # Application Pages
│   │   ├── utils/           # Validation & Helpers
│   │   ├── socket.js        # Socket.io Connection
│   │   ├── App.jsx          # Main Component
│   │   └── main.jsx         # Entry Point
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.
