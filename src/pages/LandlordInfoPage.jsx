import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addNotification } from '../Services/notifications'
import { useLanguage } from '../LanguageContext'
import './Common.css'
import './TenantInfoPage.css'

const initialForm = {
  fullName: '',
  nationality: '',
  identityType: 'nationalId',
  identityNumber: '',
  phone: '',
  email: '',
  address: '',
  capacity: 'owner',
}

function LandlordInfoPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [form, setForm] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('contractLandlordData')) || initialForm
    } catch {
      return initialForm
    }
  })
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    const landlord = {
      ...form,
      fullName: form.fullName.trim(),
      nationality: form.nationality.trim(),
      identityNumber: form.identityNumber.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
    }

    try {
      localStorage.setItem('contractLandlordData', JSON.stringify(landlord))
      addNotification(t('landlordSaved'))
      navigate('/contract-clauses')
    } catch {
      setError(t('saveError'))
    }
  }

  return (
    <main className="app-page tenant-page">
      <section className="app-container tenant-container">
        <header className="app-header">
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate('/tenant-data')}
            aria-label={t('back')}
          >
            ‹
          </button>
          <h1 className="app-title">{t('landlordTitle')}</h1>
        </header>

        <p className="tenant-description">{t('landlordDesc')}</p>

        <form className="card tenant-form" onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-error" role="alert">
              {error}
            </div>
          )}

          <label className="tenant-field">
            {t('landlordCapacity')}
            <select name="capacity" value={form.capacity} onChange={handleChange}>
              <option value="owner">{t('owner')}</option>
              <option value="agent">{t('agent')}</option>
            </select>
          </label>

          <label className="tenant-field">
            {t('fullName')}
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder={t('fullNamePh')}
              autoComplete="off"
              required
            />
          </label>

          <label className="tenant-field">
            {t('nationality')}
            <input
              name="nationality"
              value={form.nationality}
              onChange={handleChange}
              placeholder={t('nationalityPh')}
            />
          </label>

          <label className="tenant-field">
            {t('idType')}
            <select
              name="identityType"
              value={form.identityType}
              onChange={handleChange}
            >
              <option value="nationalId">{t('nationalId')}</option>
              <option value="passport">{t('passport')}</option>
            </select>
          </label>

          <label className="tenant-field">
            {t('idNumber')}
            <input
              name="identityNumber"
              value={form.identityNumber}
              onChange={handleChange}
              placeholder={t('idNumberPh')}
              required
            />
          </label>

          <label className="tenant-field">
            {t('phone')}
            <input
              name="phone"
              type="tel"
              dir="ltr"
              value={form.phone}
              onChange={handleChange}
              placeholder="01xxxxxxxxx"
              required
            />
          </label>

          <label className="tenant-field">
            {t('email')}
            <input
              name="email"
              type="email"
              dir="ltr"
              value={form.email}
              onChange={handleChange}
              placeholder="name@example.com"
            />
          </label>

          <label className="tenant-field">
            {t('landlordAddress')}
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder={t('addressPh')}
              rows={3}
              required
            />
          </label>

          <button className="btn btn-primary" type="submit">
            {t('saveContinue')}
          </button>
        </form>
      </section>
    </main>
  )
}

export default LandlordInfoPage