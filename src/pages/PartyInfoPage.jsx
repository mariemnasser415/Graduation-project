import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { addNotification } from '../Services/notifications'
import './common.css'
import './TenantInfoPage.css'

const roles = {
  residential: ['المؤجر', 'المستأجر'],
  commercial: ['المؤجر', 'المستأجر'],
  furnished: ['المؤجر', 'المستأجر'],
  sale: ['البائع', 'المشتري'],
  employment: ['صاحب العمل', 'الموظف'],
  services: ['مقدم الخدمة', 'العميل'],
  partnership: ['الشريك الأول', 'الشريك الثاني'],
  confidentiality: ['الطرف المفصح', 'الطرف المستلم'],
  other: ['الطرف الأول', 'الطرف الثاني'],
}

const emptyParty = {
  fullName: '',
  identityNumber: '',
  phone: '',
  email: '',
  address: '',
}

function readDraft() {
  try {
    const saved = JSON.parse(
      localStorage.getItem('contractPartiesDraft') || '{}',
    )
    return saved && typeof saved === 'object' ? saved : {}
  } catch {
    return {}
  }
}

function normalize(value) {
  return String(value || '').trim().toLowerCase()
}

function PartyInfoPage() {
  const navigate = useNavigate()
  const { step } = useParams()

  const isFirst = step === 'first'
  const isSecond = step === 'second'

  const [form, setForm] = useState(emptyParty)
  const [error, setError] = useState('')

  const contractType = localStorage.getItem('contractType') || 'other'
  const roleNames = roles[contractType] || roles.other
  const role = isFirst ? roleNames[0] : roleNames[1]
  const fieldKey = isFirst ? 'firstParty' : 'secondParty'

  useEffect(() => {
    const draft = readDraft()
    setForm({ ...emptyParty, ...(draft[fieldKey] || {}) })
    setError('')
  }, [fieldKey])

  if (!isFirst && !isSecond) {
    return <Navigate to="/contract-type" replace />
  }

  function update(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
    setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const currentParty = {
      ...form,
      fullName: form.fullName.trim(),
      identityNumber: form.identityNumber.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
    }

    try {
      const draft = readDraft()

      if (isSecond) {
        const firstParty = draft.firstParty || {}
        const sameIdentity =
          normalize(currentParty.identityNumber) ===
          normalize(firstParty.identityNumber)

        if (sameIdentity) {
          setError('رقم الهوية مطابق للطرف الأول. أدخلي رقم هوية مختلفًا.')
          return
        }
      }

      draft[fieldKey] = currentParty

      if (isFirst) {
        localStorage.setItem('contractPartiesDraft', JSON.stringify(draft))
        navigate('/party-info/second')
        return
      }

      const contractParties = {
        contractType,
        otherContractType: localStorage.getItem('otherContractType') || '',
        ...draft,
      }

      localStorage.setItem('contractParties', JSON.stringify(contractParties))
      localStorage.removeItem('contractPartiesDraft')

      addNotification('تم حفظ بيانات طرفي العقد بنجاح.')
      navigate('/analyze')
    } catch {
      setError('تعذر حفظ البيانات. حاولي مرة أخرى.')
    }
  }

  return (
    <main className="app-page tenant-page" dir="rtl">
      <section className="app-container tenant-container">
        <header className="app-header">
          <button
            type="button"
            className="back-btn"
            onClick={() =>
              navigate(isFirst ? '/contract-type' : '/party-info/first')
            }
            aria-label="رجوع"
          >
            ‹
          </button>

          <h1 className="app-title">بيانات {role}</h1>
        </header>

        <p className="tenant-description">
          {isFirst
            ? `أدخلي بيانات ${role} للبدء، ثم انتقلي للطرف الآخر.`
            : `أدخلي بيانات ${role} لإكمال أطراف العقد.`}
        </p>

        <form className="card tenant-form" onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-error" role="alert">
              {error}
            </div>
          )}

          <label className="tenant-field">
            الاسم بالكامل
            <input
              type="text"
              value={form.fullName}
              onChange={(event) => update('fullName', event.target.value)}
              placeholder="الاسم كما يظهر في الهوية"
              autoComplete="name"
              required
            />
          </label>

          <label className="tenant-field">
            رقم الهوية أو جواز السفر
            <input
              type="text"
              value={form.identityNumber}
              onChange={(event) =>
                update('identityNumber', event.target.value)
              }
              required
            />
          </label>

          <label className="tenant-field">
            رقم الهاتف
            <input
              type="tel"
              dir="ltr"
              value={form.phone}
              onChange={(event) => update('phone', event.target.value)}
              placeholder="01xxxxxxxxx"
              autoComplete="tel"
              required
            />
          </label>

          <label className="tenant-field">
            البريد الإلكتروني
            <input
              type="email"
              dir="ltr"
              value={form.email}
              onChange={(event) => update('email', event.target.value)}
              placeholder="name@example.com"
              autoComplete="email"
            />
          </label>

          <label className="tenant-field">
            العنوان
            <textarea
              value={form.address}
              onChange={(event) => update('address', event.target.value)}
              rows={3}
              autoComplete="street-address"
              required
            />
          </label>

          <button className="btn btn-primary" type="submit">
            {isFirst ? 'التالي: بيانات الطرف الثاني' : 'حفظ ومتابعة'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default PartyInfoPage