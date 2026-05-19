

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ChatPage from './pages/ChatPage'
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
// import ForgotPasswordPage from "./pages/ForgotPasswordPage";
// import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProtectedRoute from './components/ProtectedRoute'
import MainLayout from './components/MainLayout'

// Placeholder — we'll build this in Phase 5
function Chat() {
  return <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>Chat page — coming in Phase 5 🚀</div>
}

export default function App() {
  return (
    <div style={{ minHeight: '100vh', height: '100vh', width: '100vw' }}>  
      <BrowserRouter>
        <Routes>
          {/* public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} /> */}

          {/* Protected */}
          <Route path="/dashboard" element={<ProtectedRoute><MainLayout><DashboardPage /></MainLayout></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><MainLayout><ProfilePage /></MainLayout></ProtectedRoute>} />

          {/* fall back */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
