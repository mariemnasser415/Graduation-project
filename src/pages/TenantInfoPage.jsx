import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addNotification } from '../Services/notifications'
import './common.css'
import './TenantInfoPage.css'

const emptyParty = {
  fullName: '',
  nationality: '',
  identityType: 'nationalId',
  identityNumber: '',
  phone: '',
  email: '',
  occupation: '',
  address: '',
}

function PartyFields({ title, party, onChange, prefix }) {
  return (
    <fieldset className="tenant-party">
      <legend>{title}</legend>

      <label className="tenant-field">
        الاسم بالكامل
        <input
          value={party.fullName}
          onChange={(event) => onChange('fullName', event.target.value)}
          placeholder="اكتبي الاسم كما يظهر في الهوية"
          autoComplete="name"
          required
        />
      </label>

      <label className="tenant-field">
        الجنسية
        <input
          value={party.nationality}
          onChange={(event) => onChange('nationality', event.target.value)}
          placeholder="مثال: مصري"
          autoComplete="country-name"
        />
      </label>

      <label className="tenant-field">
        نوع إثبات الهوية
        <select
          value={party.identityType}
          onChange={(event) => onChange('identityType', event.target.value)}
        >
          <option value="nationalId">بطاقة رقم قومي</option>
          <option value="passport">جواز سفر</option>
        </select>
      </label>

      <label className="tenant-field">
        رقم الهوية أو جواز السفر
        <input
          value={party.identityNumber}
          onChange={(event) => onChange('identityNumber', event.target.value)}
          placeholder="أدخلي رقم الوثيقة"
          required
        />
      </label>

      <label className="tenant-field">
        رقم الهاتف
        <input
          type="tel"
          dir="ltr"
          value={party.phone}
          onChange={(event) => onChange('phone', event.target.value)}
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
          value={party.email}
          onChange={(event) => onChange('email', event.target.value)}
          placeholder="name@example.com"
          autoComplete="email"
        />
      </label>

      <label className="tenant-field">
        المهنة
        <input
          value={party.occupation}
          onChange={(event) => onChange('occupation', event.target.value)}
          placeholder="اكتبي المهنة"
          autoComplete="organization-title"
        />
      </label>

      <label className="tenant-field">
        عنوان السكن
        <textarea
          value={party.address}
          onChange={(event) => onChange('address', event.target.value)}
          placeholder="المحافظة، المدينة، الشارع، ورقم العقار"
          rows={3}
          autoComplete="street-address"
          required
        />
      </label>
    </fieldset>
  )
}

function TenantInfoPage() {
  const navigate = useNavigate()
  const [parties, setParties] = useState({
    lessor: { ...emptyParty },
    tenant: { ...emptyParty },
    partyOne: { ...emptyParty },
    partyTwo: { ...emptyParty },
  })
  const [error, setError] = useState('')

  const contractType = localStorage.getItem('contractType') || ''
  const isRental = ['residential', 'commercial', 'furnished'].includes(
    contractType,
  )

  function updateParty(group, field, value) {
    setParties((current) => ({
      ...current,
      [group]: {
        ...current[group],
        [field]: value,
      },
    }))
    setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    const data = isRental
      ? {
          contractType,
          lessor: parties.lessor,
          tenant: parties.tenant,
        }
      : {
          contractType,
          contractTypeName: localStorage.getItem('otherContractType') || '',
          partyOne: parties.partyOne,
          partyTwo: parties.partyTwo,
        }

    try {
      localStorage.setItem('contractParties', JSON.stringify(data))
      addNotification('تم حفظ بيانات أطراف العقد بنجاح.')
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
            onClick={() => navigate('/contract-type')}
            aria-label="رجوع لاختيار نوع العقد"
          >
            ‹
          </button>
          <h1 className="app-title">
            {isRental ? 'بيانات المؤجر والمستأجر' : 'بيانات أطراف العقد'}
          </h1>
        </header>

        <p className="tenant-description">
          {isRental
            ? 'أدخلي بيانات المؤجر والمستأجر المطلوبة لإعداد العقد.'
            : 'أدخلي بيانات طرفي العقد لإعداده.'}
        </p>

        <form className="card tenant-form" onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-error" role="alert">
              {error}
            </div>
          )}

          {isRental ? (
            <>
              <PartyFields
                title="بيانات المؤجر"
                party={parties.lessor}
                prefix="lessor"
                onChange={(field, value) =>
                  updateParty('lessor', field, value)
                }
              />
              <PartyFields
                title="بيانات المستأجر"
                party={parties.tenant}
                prefix="tenant"
                onChange={(field, value) =>
                  updateParty('tenant', field, value)
                }
              />
            </>
          ) : (
            <>
              <PartyFields
                title="بيانات الطرف الأول"
                party={parties.partyOne}
                prefix="party-one"
                onChange={(field, value) =>
                  updateParty('partyOne', field, value)
                }
              />
              <PartyFields
                title="بيانات الطرف الثاني"
                party={parties.partyTwo}
                prefix="party-two"
                onChange={(field, value) =>
                  updateParty('partyTwo', field, value)
                }
              />
            </>
          )}

          <button className="btn btn-primary" type="submit">
            حفظ ومتابعة
          </button>
        </form>
      </section>
    </main>
  )
}

export default TenantInfoPage
