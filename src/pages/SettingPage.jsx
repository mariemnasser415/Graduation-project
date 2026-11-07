import { useNavigate } from 'react-router-dom'
import { authService } from '../Services/authservice'
import { addNotification } from '../Services/notifications'
import { useLanguage } from '../LanguageContext'
import './common.css'
import './SettingPage.css'

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
  const { language, setLanguage, t } = useLanguage()

  function handleLanguageChange(event) {
    setLanguage(event.target.value)
  }

  function handleLogout() {
    addNotification(
      language === 'en'
        ? 'You have been logged out successfully.'
        : 'تم تسجيل خروجك بنجاح.',
    )
    authService.logout()
    navigate('/login', { replace: true })
  }

  const settingsLinks = [
    { label: t('editProfile'), to: '/profile/edit' },
    { label: t('changePassword'), to: '/forgot-password' },
    { label: t('createContract'), to: '/analyze' },
    { label: t('notifications'), to: '/notifications' },
    { label: t('assistant'), to: '/chat' },
  ]

  return (
    <div className="app-page">
      <div className="app-container">
        <h1 className="app-title">{t('settings')}</h1>

        <div className="card settings-card">
          {settingsLinks.map((link) => (
            <LinkRow key={link.to} {...link} />
          ))}

          <div className="settings-row">
            <label htmlFor="language-select">{t('language')}</label>

            <select
              id="language-select"
              className="settings-value"
              value={language}
              onChange={handleLanguageChange}
              aria-label={t('language')}
            >
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          {t('logout')}
        </button>
      </div>
    </div>
  )
}

export default SettingPage
