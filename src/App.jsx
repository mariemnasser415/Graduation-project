import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'

import WelcomePage from './pages/WelcomePage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import HistoryPage from './pages/HistoryPage'
import ChatPage from './pages/ChatPage'
import ProfilePage from './pages/ProfilePage'
import RegisterPage from './pages/RegisterPage'
import SettingPage from './pages/SettingPage'
import ForgotPassword from './pages/ForgotPassword'

function App() {
  return (
    <Routes>
      {/* أول صفحة تظهر لأي زائر */}
      <Route path="/" element={<WelcomePage />} />

      {/* تسجيل الدخول والحساب */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* صفحات التطبيق */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/setting" element={<SettingPage />} />
      </Route>

      {/* أي مسار غلط يرجع للبداية */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App