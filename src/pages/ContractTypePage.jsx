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
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!contractType) {
      setError('اختاري نوع العقد أولًا.')
      return
    }

    if (contractType === 'other' && !otherContractType.trim()) {
      setError('اكتبي نوع العقد.')
      return
    }

    localStorage.setItem('contractType', contractType)
    localStorage.setItem(
      'otherContractType',
      contractType === 'other' ? otherContractType.trim() : '',
    )

    // الانتقال لصفحة بيانات الطرف الأول
    navigate('/party-info/first')
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
          اختاري نوع العقد قبل إدخال بيانات الأطراف.
        </p>

        <form className="card tenant-form" onSubmit={handleSubmit}>
          <label className="tenant-field" htmlFor="contractType">
            نوع العقد
            <select
              id="contractType"
              value={contractType}
              onChange={(event) => {
                setContractType(event.target.value)
                setError('')
              }}
              required
            >
              <option value="">اختاري نوع العقد</option>
              <option value="residential">إيجار سكني</option>
              <option value="commercial">إيجار تجاري</option>
              <option value="furnished">إيجار مفروش</option>
              <option value="sale">عقد بيع</option>
              <option value="employment">عقد عمل</option>
              <option value="services">تقديم خدمات</option>
              <option value="partnership">عقد شراكة</option>
              <option value="confidentiality">اتفاقية سرية</option>
              <option value="other">أخرى</option>
            </select>
          </label>

          {contractType === 'other' && (
            <label className="tenant-field" htmlFor="otherContractType">
              اكتبي نوع العقد
              <input
                id="otherContractType"
                type="text"
                value={otherContractType}
                onChange={(event) => {
                  setOtherContractType(event.target.value)
                  setError('')
                }}
                placeholder="مثال: عقد شراكة"
                required
              />
            </label>
          )}

          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}

          <button className="btn btn-primary" type="submit">
            متابعة لبيانات الطرف الأول
          </button>
        </form>
      </section>
    </main>
  )
}

export default ContractTypePage
