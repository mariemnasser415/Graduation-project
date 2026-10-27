
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './common.css'
import './ProfilePage.css'

function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user')) || {}
  } catch {
    return {}
  }
}

function ProfilePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(getUser)
  const [saved, setSaved] = useState(false)

  const fullName = user.fullName || ''
  const identifier = user.identifier || ''
  const isEmail = identifier.includes('@')

  function handleChange(field, value) {
    setUser((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  function handleSave(e) {
    e.preventDefault()
    localStorage.setItem('user', JSON.stringify(user))
    setSaved(true)
  }

  return (
    <div className="app-page">
      <div className="app-container">
        <div className="app-header">
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate(-1)}
            aria-label="رجوع"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
          <h1 className="app-title">الملف الشخصي</h1>
        </div>

        <div className="profile-top">
          <div className="profile-avatar">
            {(fullName || '')[0]}
          </div>
          <p className="profile-name">{fullName || 'مستخدم جديد'}</p>
          {(user.email || (isEmail ? identifier : '')) && (
            <p className="profile-email" dir="ltr">
              {user.email || identifier}
            </p>
          )}
        </div>

        <form className="card profile-form" onSubmit={handleSave}>
          <div className="profile-row">
            <label htmlFor="fullName">الاسم بالكامل</label>
            <input
              id="fullName"
              type="text"
              value={user.fullName ?? ''}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="اكتب اسمك بالكامل"
              required
            />
          </div>

          <div className="profile-row">
            <label htmlFor="email">الإيميل</label>
            <input
              id="email"
              type="email"
              dir="ltr"
              value={user.email ?? (isEmail ? identifier : '')}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="name@example.com"
            />
          </div>

          <div className="profile-row">
            <label htmlFor="gender">النوع</label>
            <select
              id="gender"
              value={user.gender ?? ''}
              onChange={(e) => handleChange('gender', e.target.value)}
            >
              <option value="">اختار النوع</option>
              <option value="female">أنثى</option>
              <option value="male">ذكر</option>
              <option value="prefer-not-to-say">أفضل عدم التحديد</option>
            </select>
          </div>

          <div className="profile-row">
            <label htmlFor="birthDate">تاريخ الميلاد</label>
            <input
              id="birthDate"
              type="date"
              value={user.birthDate ?? ''}
              onChange={(e) => handleChange('birthDate', e.target.value)}
            />
          </div>

          <div className="profile-row">
            <label htmlFor="country">البلد</label>
            <input
              id="country"
              type="text"
              value={user.country ?? ''}
              onChange={(e) => handleChange('country', e.target.value)}
              placeholder="مثال: مصر"
            />
          </div>

          <div className="profile-row">
            <label htmlFor="age">السن</label>
            <input
              id="age"
              type="number"
              min="1"
              max="120"
              value={user.age ?? ''}
              onChange={(e) => handleChange('age', e.target.value)}
              placeholder="اكتب السن"
            />
          </div>

          <div className="profile-row">
            <label htmlFor="phone">رقم التليفون</label>
            <input
              id="phone"
              type="tel"
              dir="ltr"
              value={user.phone ?? (!isEmail ? identifier : '')}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="01xxxxxxxxx"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            حفظ التغييرات
          </button>

          {saved && (
            <p role="status" className="profile-success">
              تم حفظ التغييرات بنجاح
            </p>
          )}
        </form>

        <button
            type="button"
            className="btn btn-primary profile-settings"
            onClick={() => navigate('/setting')} >
            الإعدادات
        </button>
      </div>
    </div>
  )
}

export default ProfilePage
