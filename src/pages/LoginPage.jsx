import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../Services/authservice'
import { addNotification } from '../Services/notifications'
import './common.css'
import './LoginPage.css'


function LoginPage() {
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!identifier.trim() || !password) {
      setError('اكتبي البريد أو رقم الهاتف وكلمة السر')
      return
    }

    setLoading(true)
    setError('')

    try {
      await authService.login({
        identifier: identifier.trim(),
        password,
      })

      addNotification('تم تسجيل الدخول بنجاح.')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'تعذر تسجيل الدخول. حاولي مرة أخرى.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-page login-screen">
      <form className="app-container" onSubmit={handleSubmit} noValidate>
        <div className="app-header">
          <div className="icon-box" aria-hidden="true">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
              <path d="M14 3v5h5M9 13h6M9 17h6" />
            </svg>
          </div>
          <h1 className="app-title">مرحبا بعودتك</h1>
        </div>

        {error && (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        )}

        <div className="field">
          <label htmlFor="identifier">البريد الإلكتروني أو رقم الهاتف</label>
          <input
            id="identifier"
            className="input"
            type="text"
            dir="ltr"
            placeholder="name@gmail.com"
            autoComplete="username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="field">
          <label htmlFor="password">كلمة السر</label>
          <input
            id="password"
            className="input"
            type="password"
            dir="ltr"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <Link to="/forgot-password" className="link-brand login-forgot">
          نسيت كلمة السر؟
        </Link>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
        </button>

        <p className="login-footer">
          <span>ليس لديك حساب؟</span>
          <Link to="/register" className="link-brand">
            إنشاء حساب
          </Link>
        </p>
      </form>
    </div>
  )
}

export default LoginPage
