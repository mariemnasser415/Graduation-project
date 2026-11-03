import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  validateFullName,
  validateIdentifier,
  validatePassword,
  validateConfirm,
} from '../Services/validators'
import './RegisterPage.css'

// حقل واحد: label + input + رسالة خطأ
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
    setValues((v) => ({ ...v, [name]: e.target.value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }))
    if (serverError) setServerError('')
  }

  const handleBlur = (name) => () =>
    setErrors((er) => ({ ...er, [name]: validators[name]() }))

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
  const users = JSON.parse(localStorage.getItem('users') || '[]')

  const accountExists = users.some(
    (user) => user.identifier.toLowerCase() === identifier,
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

  navigate('/dashboard', { replace: true })
} catch {
  setServerError('تعذر إنشاء الحساب. حاولي مرة أخرى.')
} finally {
  setLoading(false)
}}

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
        <h1 className="register-title">إنشاء حساب جديد</h1>

        <form className="register-form" onSubmit={handleSubmit} noValidate>
          {serverError && (
            <div className="register-alert" role="alert">
              {serverError}
            </div>
          )}

          <Field
            id="fullName"
            label="الاسم كامل"
            error={errors.fullName}
          >
            <input
              {...inputProps('fullName')}
              type="text"
              placeholder="مروان أحمد"
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
              placeholder="marwan@gmail.com"
              autoComplete="username"
            />
          </Field>

          <div className="register-row">
            <Field
              id="password"
              label="كلمة السر"
              error={errors.password}
            >
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
