import { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { authService } from '../Services/authservice'
import './Common.css'
import './VerifyCodePage.css'

const CODE_LENGTH = 6
const RESEND_SECONDS = 45

function formatTime(total) {
  const m = String(Math.floor(total / 60)).padStart(2, '0')
  const s = String(total % 60).padStart(2, '0')
  return `${m}:${s}`
}

function VerifyCodePage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const email = state?.email

  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(''))
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)
  const inputs = useRef([])

  // عدّاد إعادة الإرسال
  useEffect(() => {
    if (secondsLeft <= 0) return undefined
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(id)
  }, [secondsLeft])

  // لو الصفحة اتفتحت من غير بريد نرجع لنسيت كلمة السر
  if (!email) return <Navigate to="/forgot-password" replace />

  function focusBox(i) {
    inputs.current[Math.min(Math.max(i, 0), CODE_LENGTH - 1)]?.focus()
  }

  function handleChange(i, value) {
    const digit = value.replace(/\D/g, '').slice(-1)
    setDigits((prev) => prev.map((d, idx) => (idx === i ? digit : d)))
    setError('')
    if (digit) focusBox(i + 1)
  }

  function handleKeyDown(i, e) {
    if (e.key === 'Backspace' && !digits[i]) {
      focusBox(i - 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      focusBox(i - 1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      focusBox(i + 1)
    }
  }

  function handlePaste(e) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH)
    if (!pasted) return
    e.preventDefault()
    setDigits(Array.from({ length: CODE_LENGTH }, (_, i) => pasted[i] ?? ''))
    setError('')
    focusBox(pasted.length)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const code = digits.join('')
    if (code.length < CODE_LENGTH) {
      setError(`اكتب الرمز كاملًا (${CODE_LENGTH} أرقام)`)
      return
    }
    // مؤقتًا: بنعدّي على صفحة كلمة المرور الجديدة من غير ما نكلّم الـ Backend
    navigate('/reset-password', { state: { email, code }, replace: true })
  }
  async function handleResend() {
    if (secondsLeft > 0) return
    // نصفّر الأرقام فورًا أول ما يدوس
    setDigits(Array(CODE_LENGTH).fill(''))
    setError('')
    setInfo('')
    focusBox(0)
    try {
      await authService.forgotPassword({ email })
      setSecondsLeft(RESEND_SECONDS)
      setInfo('تم إرسال رمز جديد إلى بريدك الإلكتروني')
    } catch (err) {
      setError(err.message)
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
          <h1 className="app-title">إدخال رمز التحقق</h1>
        </div>

        <p className="app-subtitle">
          أرسلنا رمزًا من {CODE_LENGTH} أرقام إلى بريدك الإلكتروني.
        </p>
        <p className="verify-email" dir="ltr">{email}</p>

        {error && <div className="alert alert-error" role="alert">{error}</div>}
        {info && <div className="alert alert-success" role="status">{info}</div>}

        <div className="otp-row" dir="ltr" onPaste={handlePaste}>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputs.current[i] = el }}
              className={`otp-box${error ? ' otp-box-error' : ''}`}
              type="text"
              inputMode="numeric"
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onFocus={(e) => e.target.select()}
              disabled={loading}
              aria-label={`الرقم ${i + 1} من ${CODE_LENGTH}`}
              autoFocus={i === 0}
            />
          ))}
        </div>

        <p className="verify-timer">
          {secondsLeft > 0 ? (
            <>إعادة إرسال الرمز بعد <span dir="ltr">{formatTime(secondsLeft)}</span></>
          ) : (
            <button type="button" className="verify-resend" onClick={handleResend}>
              إعادة إرسال الرمز
            </button>
          )}
        </p>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'جاري التحقق...' : 'تحقق'}
        </button>

        <button
          type="button"
          className="btn verify-back"
          onClick={() => navigate('/forgot-password')}
          disabled={loading}
        >
          العودة
        </button>
      </form>
    </div>
  )
}

export default VerifyCodePage