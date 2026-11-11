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
import VerifyCodePage from './pages/VerifyCodePage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import ContractUploadPage from './pages/ContractUploadPage'
import ResultPage from './pages/ResultPage'
import ProfileEditPage from './pages/ProfileEditPage'
import NotificationsPage from './pages/NotificationsPage'
import TenantInfoPage from './pages/TenantInfoPage'
import ContractTypePage from './pages/ContractTypePage'
import LandlordInfoPage from './pages/LandlordInfoPage' 
import PartyInfoPage from './pages/PartyInfoPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-code" element={<VerifyCodePage />} />

      <Route element={<MainLayout />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="setting" element={<SettingPage />} />
        <Route path="analyze" element={<ContractUploadPage />} />
        <Route path="analysis-results" element={<ResultPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="profile/edit" element={<ProfileEditPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="tenant-data" element={<TenantInfoPage />} />
        <Route path="landlord-data" element={<LandlordInfoPage />} /> {/* ← جديد */}
        <Route path="contract-type" element={<ContractTypePage />} />
        <Route path="party-info/:step" element={<PartyInfoPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
