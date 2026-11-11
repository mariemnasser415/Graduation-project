import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addNotification } from '../Services/notifications'
import './common.css'
import './ProfileEditPage.css'

function readUser() {
  try {
    return JSON.parse(localStorage.getItem('user')) || {}
  } catch {
    return {}
  }
}

function ProfileEditPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(readUser)
  const [saved, setSaved] = useState(false)

  function update(field, value) {
    setUser((current) => ({ ...current, [field]: value }))
    setSaved(false)
  }

  function handleSubmit(event) {
    event.preventDefault()

    try {
      localStorage.setItem('user', JSON.stringify(user))
      addNotification('تم تعديل بياناتك بنجاح.')
      setSaved(true)
    } catch {
      setSaved(false)
    }
  }

  return (
    <main className="app-page profile-screen profile-edit-screen" dir="rtl">
      <section className="app-container">
        <header className="app-header">
          <button
            className="back-btn"
            type="button"
            onClick={() => navigate('/profile')}
            aria-label="رجوع للملف الشخصي"
          >
            ‹
          </button>
          <h1 className="app-title">تعديل البيانات</h1>
        </header>

        <form className="card profile-form" onSubmit={handleSubmit}>
          <label className="profile-row">
            الاسم بالكامل
            <input
              value={user.fullName || ''}
              onChange={(event) => update('fullName', event.target.value)}
              placeholder="اكتب اسمك بالكامل"
              required
            />
          </label>

          <label className="profile-row">
            البريد الإلكتروني
            <input
              type="email"
              dir="ltr"
              value={
                user.email ||
                (user.identifier?.includes('@') ? user.identifier : '')
              }
              onChange={(event) => {
                const email = event.target.value
                setUser((current) => ({
                  ...current,
                  email,
                  identifier: email,
                }))
                setSaved(false)
              }}
              placeholder="name@example.com"
            />
          </label>

          <label className="profile-row">
            النوع
            <select
              value={user.gender || ''}
              onChange={(event) => update('gender', event.target.value)}
            >
              <option value="">اختاري النوع</option>
              <option value="أنثى">أنثى</option>
              <option value="ذكر">ذكر</option>
              <option value="أفضل عدم التحديد">أفضل عدم التحديد</option>
            </select>
          </label>

          <label className="profile-row">
            تاريخ الميلاد
            <input
              type="date"
              value={user.birthDate || ''}
              onChange={(event) => update('birthDate', event.target.value)}
            />
          </label>

          <label className="profile-row">
            البلد
            <input
              value={user.country || ''}
              onChange={(event) => update('country', event.target.value)}
              placeholder="مثال: مصر"
            />
          </label>

          <label className="profile-row">
            العمر
            <input
              type="number"
              min="1"
              max="120"
              value={user.age || ''}
              onChange={(event) => update('age', event.target.value)}
              placeholder="اكتب عمرك"
            />
          </label>

          <label className="profile-row">
            رقم الهاتف
            <input
              type="tel"
              dir="ltr"
              value={user.phone || ''}
              onChange={(event) => update('phone', event.target.value)}
              placeholder="01xxxxxxxxx"
            />
          </label>

          <button className="btn btn-primary" type="submit">
            حفظ البيانات
          </button>

          {saved && (
            <p className="profile-success" role="status">
              تم حفظ البيانات وإضافة إشعار بنجاح.
            </p>
          )}
        </form>
      </section>
    </main>
  )
}

export default ProfileEditPage
