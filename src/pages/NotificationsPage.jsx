import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getNotifications } from '../Services/notifications'
import './common.css'
import './NotificationsPage.css'

function NotificationsPage() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(getNotifications)

  useEffect(() => {
    const updateNotifications = () => {
      setNotifications(getNotifications())
    }

    window.addEventListener('notifications-updated', updateNotifications)

    return () => {
      window.removeEventListener('notifications-updated', updateNotifications)
    }
  }, [])

  return (
    <main className="app-page notifications-screen" dir="rtl">
      <section className="app-container">
        <header className="app-header">
          <button
            className="back-btn"
            type="button"
            onClick={() => navigate('/setting')}
            aria-label="رجوع للإعدادات"
          >
            ‹
          </button>

          <h1 className="app-title">الإشعارات</h1>
        </header>

        <h2 className="notifications-history-title">آخر الإشعارات</h2>

        <div className="card notifications-history">
          {notifications.length === 0 ? (
            <p className="notifications-empty">لا توجد إشعارات حتى الآن.</p>
          ) : (
            notifications.map((item) => (
              <article className="notification-item" key={item.id}>
                <p>{item.message}</p>
                <time>
                  {new Date(item.date).toLocaleString('ar-EG')}
                </time>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  )
}

export default NotificationsPage