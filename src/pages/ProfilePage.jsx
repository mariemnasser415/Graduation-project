import { useNavigate } from 'react-router-dom'
import { addNotification } from '../Services/notifications'
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
  const user = getUser()

  const fullName = user.fullName || user.name || 'مستخدم جديد'
  const email =
    user.email || (user.identifier?.includes('@') ? user.identifier : '')

  const details = [
    { label: 'النوع', value: user.gender || 'غير مضاف' },
    { label: 'تاريخ الميلاد', value: user.birthDate || 'غير مضاف' },
    { label: 'البلد', value: user.country || 'غير مضاف' },
    { label: 'العمر', value: user.age || 'غير مضاف' },
    { label: 'رقم الهاتف', value: user.phone || 'غير مضاف', dir: 'ltr' },
  ]

  function handleEditClick() {
    addNotification('بدأتِ تعديل بيانات الملف الشخصي.')
    navigate('/profile/edit')
  }

  return (
    <main className="app-page profile-screen" dir="rtl">
      <section className="app-container">
        <header className="app-header">
          <h1 className="app-title">الملف الشخصي</h1>
        </header>

        <div className="profile-summary card">
          <div className="profile-identity">
            <div className="profile-avatar" aria-hidden="true">
              {fullName[0]}
            </div>

            <div className="profile-identity-text">
              <h2>{fullName}</h2>
              <p className="profile-email" dir="ltr">
                {email || 'البريد الإلكتروني غير مضاف'}
              </p>
            </div>
          </div>

          <section className="profile-details" aria-label="البيانات الشخصية">
            {details.map((item) => (
              <div className="profile-detail" key={item.label}>
                <span>{item.label}</span>
                <strong dir={item.dir || 'rtl'}>{item.value}</strong>
              </div>
            ))}
          </section>

          <button
            className="btn btn-primary profile-edit-button"
            type="button"
            onClick={handleEditClick}
          >
            تعديل البيانات
          </button>
        </div>
      </section>
    </main>
  )
}

export default ProfilePage
