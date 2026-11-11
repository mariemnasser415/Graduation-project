import { Link, NavLink, Outlet } from 'react-router-dom'
import { useLanguage } from '../LanguageContext'
import './MainLayout.css'

function MainLayout() {
  const { t } = useLanguage()

  return (
    <div className="layout">
      <aside className="sidebar">
        <Link
          to="/dashboard"
          className="sidebar-brand"
          aria-label="LegalLens AI"
        >
          <img src="/legallens-logo.svg" alt="LegalLens AI" />
        </Link>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" end>
            {t('home')}
          </NavLink>

          <NavLink to="/history">
            {t('contracts')}
          </NavLink>

          <NavLink to="/chat">
            {t('assistant')}
          </NavLink>

          <NavLink to="/profile">
            {t('profile')}
          </NavLink>

          <NavLink to="/setting">
            {t('settings')}
          </NavLink>
        </nav>
      </aside>

      <main className="layout-content">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
