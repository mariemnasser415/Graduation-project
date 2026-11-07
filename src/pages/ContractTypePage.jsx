import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './common.css'
import './TenantInfoPage.css'

function ContractTypePage() {
  const navigate = useNavigate()

  const [contractType, setContractType] = useState(
    () => localStorage.getItem('contractType') || '',
  )
  const [otherContractType, setOtherContractType] = useState(
    () => localStorage.getItem('otherContractType') || '',
  )

  function handleSubmit(event) {
    event.preventDefault()

    if (!contractType) return

    if (contractType === 'other' && !otherContractType.trim()) return

    localStorage.setItem('contractType', contractType)
    localStorage.setItem(
      'otherContractType',
      contractType === 'other' ? otherContractType.trim() : '',
    )

    navigate('/tenant-data')
  }

  return (
    <main className="app-page tenant-page" dir="rtl">
      <section className="app-container tenant-container">
        <header className="app-header">
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate(-1)}
            aria-label="رجوع"
          >
            ‹
          </button>

          <h1 className="app-title">اختيار نوع العقد</h1>
        </header>

        <p className="tenant-description">
          اختاري نوع العقد قبل إدخال بيانات المستأجر.
        </p>

        <form className="card tenant-form" onSubmit={handleSubmit}>
          <label className="tenant-field">
            نوع العقد
            <select
              value={contractType}
              onChange={(event) => setContractType(event.target.value)}
              required
            >
              <option value="">اختاري نوع العقد</option>
              <option value="residential">إيجار سكني</option>
              <option value="commercial">إيجار تجاري</option>
              <option value="furnished">إيجار مفروش</option>
              <option value="other">أخرى</option>
            </select>
          </label>

          {contractType === 'other' && (
            <label className="tenant-field">
              اكتبي نوع العقد
              <input
                value={otherContractType}
                onChange={(event) => setOtherContractType(event.target.value)}
                placeholder="مثال: عقد شراكة"
                required
              />
            </label>
          )}

          <button className="btn btn-primary" type="submit">
            متابعة لبيانات المستأجر
          </button>
        </form>
      </section>
    </main>
  )
}

export default ContractTypePage