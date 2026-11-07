import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { authService } from '../Services/authservice'
import { validatePassword, validateConfirm } from '../Services/validators'
import './Common.css'
import './ResetPasswordPage.css'

function ResetPasswordPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const email = state?.email
  const code = state?.code

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  // لو حد فتح الصفحة من غير ما يعدي على التحقق نرجّعه
  if (!email || !code) return <Navigate to="/forgot-password" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {
      password: validatePassword(password),
      confirm: validateConfirm(password, confirm),
    }
    setErrors(newErrors)
    if (newErrors.password || newErrors.confirm) return

    setLoading(true)
    setError('')
    try {
      await authService.resetPassword({ email, code, password })
      setDone(true)
      setTimeout(() => navigate('/login', { replace: true }), 1500)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="app-page">
      <form className="app-container" onSubmit={handleSubmit} noValidate>
        <div className="app-header">
          <button type="button" className="back-btn" onClick={() => navigate(-1)} aria-label="رجوع">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
          <h1 className="app-title">كلمة مرور جديدة</h1>
        </div>

        <p className="app-subtitle">اكتب كلمة السر الجديدة لحسابك.</p>

        {error && <div className="alert alert-error" role="alert">{error}</div>}
        {done && (
          <div className="alert alert-success" role="status">
            تم تغيير كلمة السر بنجاح، جاري تحويلك لتسجيل الدخول...
          </div>
        )}

        <div className={`field${errors.password ? ' has-error' : ''}`}>
          <label htmlFor="password">كلمة السر الجديدة</label>
          <input
            id="password"
            className="input"
            type="password"
            dir="ltr"
            autoComplete="new-password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors({}) }}
            disabled={loading}
          />
          {errors.password && <p className="field-error">{errors.password}</p>}
        </div>

        <div className={`field${errors.confirm ? ' has-error' : ''}`}>
          <label htmlFor="confirm">تأكيد كلمة السر</label>
          <input
            id="confirm"
            className="input"
            type="password"
            dir="ltr"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => { setConfirm(e.target.value); setErrors({}) }}
            disabled={loading}
          />
          {errors.confirm && <p className="field-error">{errors.confirm}</p>}
        </div>

        <button type="submit" className="btn btn-primary reset-submit" disabled={loading}>
          {loading ? 'جاري الحفظ...' : 'حفظ كلمة السر'}
        </button>
      </form>
    </div>
  )
}

export default ResetPasswordPage