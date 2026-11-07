import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../Services/authservice'
import './Common.css'
import './ForgotPassword.css'

function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('اكتب بريد إلكتروني صحيح')
      return
    }
    setLoading(true)
    setError('')
    try {
      await authService.forgotPassword({ email: email.trim() })
    } catch {
      // مؤقتًا: لو الـ Backend مش شغال نكمّل لصفحة الرمز عادي
    } finally {
      setLoading(false)
    }
    navigate('/verify-code', { state: { email: email.trim() } })
  }

  return (
  <div className="app-page forgot-screen">
      <form className="app-container" onSubmit={handleSubmit} noValidate>
        <div className="app-header">
          <button type="button" className="back-btn" onClick={() => navigate(-1)} aria-label="رجوع">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
          <h1 className="app-title">نسيت كلمة السر</h1>
        </div>

        <p className="app-subtitle">
          اكتب بريدك الإلكتروني وسنرسل لك رمز تحقق لإعادة تعيين كلمة السر.
        </p>

        {error && <div className="alert alert-error" role="alert">{error}</div>}

        <div className="field">
          <label htmlFor="email">البريد الإلكتروني</label>
          <input
            id="email"
            className="input"
            type="email"
            dir="ltr"
            placeholder="name@email.com"
            autoComplete="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError('') }}
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn btn-primary forgot-send" disabled={loading}>
          {loading ? 'جاري الإرسال...' : 'إرسال الرمز'}
        </button>

        <Link to="/login" className="btn forgot-back">
          العودة لتسجيل الدخول
        </Link>
      </form>
    </div>
  )
}

export default ForgotPassword
