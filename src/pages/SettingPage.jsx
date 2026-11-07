import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../Services/authservice'
import './common.css'
import './SettingPage.css'

const settingsLinks = [
  { label: 'تعديل البيانات', to: '/profile/edit' },
  { label: 'تغيير كلمة السر', to: '/forgot-password' },
  { label: 'إنشاء عقد الآن', to: '/analyze' },
  { label: 'المساعد الذكي', to: '/chat' },
]

function Chevron() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

function LinkRow({ label, to }) {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      className="settings-row"
      onClick={() => navigate(to)}
    >
      <span>{label}</span>
      <Chevron />
    </button>
  )
}

function SettingPage() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(true)

  const handleLogout = () => {
    authService.logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-page">
      <div className="app-container">
        <h1 className="app-title">الإعدادات</h1>

        <div className="card settings-card">
          {settingsLinks.slice(0, 3).map((link) => (
            <LinkRow key={link.to} {...link} />
          ))}

          <div className="settings-row">
            <span>الإشعارات</span>
            <button
              type="button"
              role="switch"
              aria-checked={notifications}
              aria-label="الإشعارات"
              className={`toggle${notifications ? ' on' : ''}`}
              onClick={() => setNotifications((value) => !value)}
            />
          </div>

          <div className="settings-row">
            <span>اللغة</span>
            <span className="settings-value">العربية</span>
          </div>

          <LinkRow {...settingsLinks[3]} />
        </div>

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  )
}

export default SettingPage
