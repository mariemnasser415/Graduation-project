import { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { authService } from '../Services/authservice'
import { addNotification } from '../Services/notifications'
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

  useEffect(() => {
    if (secondsLeft <= 0) return undefined

    const id = setTimeout(() => setSecondsLeft((seconds) => seconds - 1), 1000)
    return () => clearTimeout(id)
  }, [secondsLeft])

  if (!email) {
    return <Navigate to="/forgot-password" replace />
  }

  function focusBox(index) {
    inputs.current[
      Math.min(Math.max(index, 0), CODE_LENGTH - 1)
    ]?.focus()
  }

  function handleChange(index, value) {
    const digit = value.replace(/\D/g, '').slice(-1)

    setDigits((previous) =>
      previous.map((current, currentIndex) =>
        currentIndex === index ? digit : current,
      ),
    )
    setError('')

    if (digit) focusBox(index + 1)
  }

  function handleKeyDown(index, event) {
    if (event.key === 'Backspace' && !digits[index]) {
      focusBox(index - 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      focusBox(index - 1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      focusBox(index + 1)
    }
  }

  function handlePaste(event) {
    const pasted = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, CODE_LENGTH)

    if (!pasted) return

    event.preventDefault()
    setDigits(
      Array.from({ length: CODE_LENGTH }, (_, index) => pasted[index] ?? ''),
    )
    setError('')
    focusBox(pasted.length)
  }

  function handleSubmit(event) {
    event.preventDefault()

    const code = digits.join('')

    if (code.length < CODE_LENGTH) {
      setError(`اكتب الرمز كاملًا (${CODE_LENGTH} أرقام)`)
      return
    }

    addNotification('تم إدخال رمز التحقق والانتقال لإعادة تعيين كلمة السر.')
    navigate('/reset-password', { state: { email, code }, replace: true })
  }

  async function handleResend() {
    if (secondsLeft > 0 || loading) return

    setDigits(Array(CODE_LENGTH).fill(''))
    setError('')
    setInfo('')
    setLoading(true)
    focusBox(0)

    try {
      await authService.forgotPassword({ email })
      setSecondsLeft(RESEND_SECONDS)
      setInfo('تم إرسال رمز جديد إلى بريدك الإلكتروني')
      addNotification('تم طلب إعادة إرسال رمز التحقق.')
    } catch (err) {
      setError(err.message || 'تعذر إعادة إرسال الرمز.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-page verify-screen">
      <form className="app-container" onSubmit={handleSubmit} noValidate>
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
          <h1 className="app-title">إدخال رمز التحقق</h1>
        </div>

        <p className="app-subtitle">
          أرسلنا رمزًا من {CODE_LENGTH} أرقام إلى بريدك الإلكتروني.
        </p>
        <p className="verify-email" dir="ltr">
          {email}
        </p>

        {error && (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        )}
        {info && (
          <div className="alert alert-success" role="status">
            {info}
          </div>
        )}

        <div className="otp-row" dir="ltr" onPaste={handlePaste}>
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputs.current[index] = element
              }}
              className={`otp-box${error ? ' otp-box-error' : ''}`}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? 'one-time-code' : 'off'}
              maxLength={1}
              value={digit}
              onChange={(event) => handleChange(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onFocus={(event) => event.target.select()}
              disabled={loading}
              aria-label={`الرقم ${index + 1} من ${CODE_LENGTH}`}
              autoFocus={index === 0}
            />
          ))}
        </div>

        <p className="verify-timer">
          {secondsLeft > 0 ? (
            <>
              إعادة إرسال الرمز بعد{' '}
              <span dir="ltr">{formatTime(secondsLeft)}</span>
            </>
          ) : (
            <button
              type="button"
              className="verify-resend"
              onClick={handleResend}
              disabled={loading}
            >
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
