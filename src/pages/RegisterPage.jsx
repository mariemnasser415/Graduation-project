import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  validateFullName,
  validateIdentifier,
  validatePassword,
  validateConfirm,
} from '../Services/validators'
import { addNotification } from '../Services/notifications'
import './RegisterPage.css'

function Field({ id, label, error, children }) {
  return (
    <div className={`register-field${error ? ' has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && (
        <p className="register-error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

function RegisterPage() {
  const navigate = useNavigate()

  const [values, setValues] = useState({
    fullName: '',
    identifier: '',
    password: '',
    confirm: '',
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const validators = {
    fullName: () => validateFullName(values.fullName),
    identifier: () => validateIdentifier(values.identifier),
    password: () => validatePassword(values.password),
    confirm: () => validateConfirm(values.password, values.confirm),
  }

  const handleChange = (name) => (e) => {
    setValues((current) => ({ ...current, [name]: e.target.value }))
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: '' }))
    }
    if (serverError) setServerError('')
  }

  const handleBlur = (name) => () => {
    setErrors((current) => ({ ...current, [name]: validators[name]() }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const nextErrors = Object.fromEntries(
      Object.keys(validators).map((key) => [key, validators[key]()]),
    )
    setErrors(nextErrors)

    if (Object.values(nextErrors).some(Boolean)) return

    setLoading(true)
    setServerError('')

    try {
      const identifier = values.identifier.trim().toLowerCase()
      const savedUsers = JSON.parse(localStorage.getItem('users') || '[]')
      const users = Array.isArray(savedUsers) ? savedUsers : []

      const accountExists = users.some(
        (user) => user.identifier?.trim().toLowerCase() === identifier,
      )

      if (accountExists) {
        setServerError('هذا البريد الإلكتروني أو الرقم مسجل بالفعل.')
        return
      }

      const newUser = {
        fullName: values.fullName.trim(),
        identifier,
        email: identifier.includes('@') ? identifier : '',
      }

      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))
      localStorage.setItem('user', JSON.stringify(newUser))

      addNotification('تم إنشاء حسابك بنجاح.')
      navigate('/dashboard', { replace: true })
    } catch {
      setServerError('تعذر إنشاء الحساب. حاولي مرة أخرى.')
    } finally {
      setLoading(false)
    }
  }

  const inputProps = (name) => ({
    id: name,
    className: 'register-input',
    value: values[name],
    onChange: handleChange(name),
    onBlur: handleBlur(name),
    disabled: loading,
    'aria-invalid': errors[name] ? 'true' : 'false',
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  })

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
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

          <h1 className="register-title">إنشاء حساب جديد</h1>
        </div>

        <form className="register-form" onSubmit={handleSubmit} noValidate>
          {serverError && (
            <div className="register-alert" role="alert">
              {serverError}
            </div>
          )}

          <Field id="fullName" label="الاسم كامل" error={errors.fullName}>
            <input
              {...inputProps('fullName')}
              type="text"
              placeholder="الاسم"
              autoComplete="name"
            />
          </Field>

          <Field
            id="identifier"
            label="البريد الإلكتروني أو الرقم"
            error={errors.identifier}
          >
            <input
              {...inputProps('identifier')}
              type="text"
              dir="ltr"
              placeholder="example@gmail.com"
              autoComplete="username"
            />
          </Field>

          <div className="register-row">
            <Field id="password" label="كلمة السر" error={errors.password}>
              <input
                {...inputProps('password')}
                type="password"
                dir="ltr"
                placeholder="8 أحرف على الأقل"
                autoComplete="new-password"
              />
            </Field>

            <Field
              id="confirm"
              label="تأكيد كلمة السر"
              error={errors.confirm}
            >
              <input
                {...inputProps('confirm')}
                type="password"
                dir="ltr"
                placeholder="أعد كتابتها"
                autoComplete="new-password"
              />
            </Field>
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading && (
              <span className="register-spinner" aria-hidden="true" />
            )}
            {loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
          </button>
        </form>

        <p className="register-footer">
          <span>لديك حساب بالفعل؟</span>
          <Link to="/login">تسجيل الدخول</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
