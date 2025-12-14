# QuizzArena – Online Quiz Competition Management System (Backend & Integration Guide)

QuizzArena is a MERN-based platform for hosting online quiz competitions.  
Users can create quizzes, generate join codes, host live quiz sessions, and let participants join and answer in real time.

This README explains:

- What the backend already does
- API endpoints and data formats
- How authentication works
- How quiz + session logic works
- What the frontend team must build and keep in mind

---

## 📌 1. Project Overview

Core idea:

- Logged-in users can create quizzes with multiple questions and options.
- A **quiz session** can be created for any quiz; the system generates a **join code**.
- Other logged-in users can join the session using the join code.
- The host (quiz creator) controls starting the quiz and moving to next questions.
- Participants answer questions in real time.
- Backend tracks participants, answers, and status.

---

## 🧱 2. Tech Stack

**Backend**

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (JSON Web Token) stored in httpOnly cookies
- bcryptjs (password hashing)
- cors
- dotenv
- nodemon (development)

**Frontend (expected)**

- React + React Router
- Tailwind CSS
- Axios (with `withCredentials: true`)

---

## 🗂 3. Backend Folder Structure

```bash
backend/
│
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   │
│   ├── controllers/
│   │   ├── authController.js     # register, login, me, logout
│   │   ├── quizController.js     # create quiz, list quizzes
│   │   └── sessionController.js  # create session, join, start, next, answer
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT protection
│   │   └── errorHandler.js       # central error handler
│   │
│   ├── models/
│   │   ├── user.js               # User schema
│   │   ├── quiz.js               # Quiz schema
│   │   └── quizzSession.js       # Quiz session schema
│   │
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth/...
│   │   ├── quizRoutes.js         # /api/quizzes/...
│   │   └── sessionRoutes.js      # /api/sessions/...
│   │
│   ├── utils/
│   │   └── app.js / server.js    # express app & server startup
│   │
│   └── server.js                 # main entry (depending on setup)
│
├── .env
├── package.json
└── README.md



# QuizzArena – Frontend Responsibilities Guide

This document explains what the backend already provides and what the frontend team must implement for QuizzArena. The backend is COMPLETE, so the frontend must follow this guide to correctly integrate with all API functionalities.

---

## What the Backend Already Covers

The backend has fully implemented:

### 1. Authentication (JWT + Cookies)
- Register user
- Login user
- Logout user
- Get logged-in user (`/auth/me`)
- Password hashing
- JWT-based session handling

### 2. User Model
Includes:
- username
- fullName
- email
- password
- role
- totalScore
- quizzesTaken

### 3. Quiz Management
Backend supports:
- Creating quizzes
- Adding multiple questions per quiz
- Each question has:
  - text
  - array of options
  - correctIndex

### 4. Session Management
Backend supports:
- Creating quiz sessions
- Generating join codes
- Joining a session
- Waiting room system
- Starting a quiz
- Fetching live questions
- Host controls (“next question”)
- Submitting answers
- Tracking participants
- Ending the quiz

### 5. Real-time Polling Support
Backend exposes these endpoints for the frontend to poll:
- `/sessions/:sessionId/current`
- `/sessions/:sessionId`

---

## What the Frontend Team MUST Build

The following pages and components must be created by the frontend. Each must follow the API structure provided by the backend.

### 1. Public Landing Page (Home)
- Shows project introduction and features
- Buttons: Login / Register

### 2. Auth Pages
- **Login Page**
  - Calls `/auth/login`
- **Register Page**
  - Calls `/auth/register`

### 3. Global Authentication System
Frontend must:
- Create `AuthContext`
- Store logged-in user data
- Fetch `/auth/me` on app load
- Handle redirects if not logged in

### 4. ProtectedRoute Component
Wrap all pages that require login.

### 5. Dashboard Page
After login, dashboard must show:
- User info
- Buttons:
  - Create Quiz
  - My Quizzes
  - Join Quiz
  - Active Sessions (optional)

### 6. Create Quiz Page
Form must allow:
- Quiz title
- Description
- Add multiple questions
- Add options (4 per question)
- Mark correct answer

Send to backend as:
```json
{
  "title": "",
  "description": "",
  "questions": [
    {
      "text": "",
      "options": ["", "", "", ""],
      "correctIndex": 0
    }
  ]
}
