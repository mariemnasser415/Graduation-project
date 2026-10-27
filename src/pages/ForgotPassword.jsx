import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../Services/authservice'
import './common.css'
import './ForgotPassword.css'

function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('اكتبي بريد إلكتروني صحيح')
      return
    }
    setLoading(true)
    setError('')
    try {
      await authService.forgotPassword({ email: email.trim() })
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
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
          <h1 className="app-title">نسيت كلمة السر</h1>
        </div>

        <p className="app-subtitle">
          اكتبي بريدك الإلكتروني وسنرسل لك رمز تحقق لإعادة تعيين كلمة السر.
        </p>

        {error && <div className="alert alert-error" role="alert">{error}</div>}
        {sent && <div className="alert alert-success" role="status">تم إرسال الرمز إلى بريدك الإلكتروني</div>}

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

        <Link to="/login" className="btn btn-light forgot-back">
          العودة لتسجيل الدخول
        </Link>
      </form>
    </div>
  )
}

export default ForgotPassword