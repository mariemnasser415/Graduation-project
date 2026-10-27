import { NavLink, Outlet } from 'react-router-dom'
import './MainLayout.css'

function MainLayout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">LegalLens AI</div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" end>الرئيسية</NavLink>
          <NavLink to="/history">سجل العقود</NavLink>
          <NavLink to="/chat">المساعد الذكي</NavLink>
          <NavLink to="/profile">حسابي</NavLink>
          <NavLink to="/setting">الاعدادات</NavLink>
        </nav>
      </aside>

      <main className="layout-content">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
