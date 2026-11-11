import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addNotification } from '../Services/notifications'
import './common.css'
import './TenantInfoPage.css'

const initialForm = {
fullName: '',
nationality: '',
identityType: 'nationalId',
identityNumber: '',
phone: '',
email: '',
occupation: '',
address: '',
}

function TenantInfoPage() {
const navigate = useNavigate()
const [form, setForm] = useState(initialForm)
const [error, setError] = useState('')

  function handleChange(event) {
const { name, value } = event.target
setForm((current) => ({ ...current, [name]: value }))
setError('')
}

  function handleSubmit(event) {
event.preventDefault()
const tenant = {
  ...form,
  fullName: form.fullName.trim(),
  nationality: form.nationality.trim(),
  identityNumber: form.identityNumber.trim(),
  phone: form.phone.trim(),
  email: form.email.trim(),
  occupation: form.occupation.trim(),
  address: form.address.trim(),
}

try {
  localStorage.setItem('contractTenantData', JSON.stringify(tenant))
  addNotification('تم حفظ بيانات المستأجر بنجاح.')
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
onClick={() => navigate('/setting')}
aria-label="رجوع للإعدادات"
>
‹
</button>
<h1 className="app-title">بيانات المستأجر</h1>
</header>
    <p className="tenant-description">
      أدخل بيانات المستأجر المطلوبة لإعداد العقد.
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
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="اكتب الاسم كما يظهر في الهوية"
          autoComplete="name"
          required
        />
      </label>

      <label className="tenant-field">
        الجنسية
        <input
          name="nationality"
          value={form.nationality}
          onChange={handleChange}
          placeholder="مثال: مصري"
          autoComplete="country-name"
        />
      </label>

      <label className="tenant-field">
        نوع إثبات الهوية
        <select
          name="identityType"
          value={form.identityType}
          onChange={handleChange}
        >
          <option value="nationalId">بطاقة رقم قومي</option>
          <option value="passport">جواز سفر</option>
        </select>
      </label>

      <label className="tenant-field">
        رقم الهوية أو جواز السفر
        <input
          name="identityNumber"
          value={form.identityNumber}
          onChange={handleChange}
          placeholder="أدخلي رقم الوثيقة"
          required
        />
      </label>

      <label className="tenant-field">
        رقم الهاتف
        <input
          name="phone"
          type="tel"
          dir="ltr"
          value={form.phone}
          onChange={handleChange}
          placeholder="01xxxxxxxxx"
          autoComplete="tel"
          required
        />
      </label>

      <label className="tenant-field">
        البريد الإلكتروني
        <input
          name="email"
          type="email"
          dir="ltr"
          value={form.email}
          onChange={handleChange}
          placeholder="name@example.com"
          autoComplete="email"
        />
      </label>

      <label className="tenant-field">
        المهنة
        <input
          name="occupation"
          value={form.occupation}
          onChange={handleChange}
          placeholder="اكتب المهنة"
          autoComplete="organization-title"
        />
      </label>

      <label className="tenant-field">
        عنوان السكن
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="المحافظة، المدينة، الشارع، ورقم العقار"
          rows={3}
          autoComplete="street-address"
          required
        />
      </label>

      <button className="btn btn-primary" type="submit">
        حفظ ومتابعة
      </button>
    </form>
  </section>
</main>

  )
}

export default TenantInfoPage