import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './WelcomePage.css'

const slides = [
  {
    title: 'افهم عقدك قبل ما توقع',
    text: 'ارفع عقدك ونكشف لك البنود الخطيرة في ثوانٍ أو أنشئ عقدًا جديدًا بخطوات بسيطة.',
  },
  {
    title: 'حلّل بنود العقد',
    text: 'نوضح لك البنود غير العادلة ونبسّط لك اللغة القانونية.',
  },
  {
    title: 'ابدأ الآن',
    text: 'سجّل دخولك أو أنشئ حسابًا جديدًا وابدأ رحلتك.',
  },
]

function WelcomePage() {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)

  const isLast = index === slides.length - 1
  const slide = slides[index]

  const handleNext = () => {
    if (isLast) {
      navigate('/login') // آخر شريحة -> صفحة تسجيل الدخول
    } else {
      setIndex((i) => i + 1)
    }
  }

  const handlePrev = () => setIndex((i) => Math.max(0, i - 1))

  return (
    <div className="welcome-page">
      <div className="welcome-card">
        <div className="welcome-icon" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
            <path d="M14 3v5h5M9 13h6M9 17h6" />
          </svg>
        </div>

        <h1 className="welcome-title">{slide.title}</h1>
        <p className="welcome-text">{slide.text}</p>

        <div className="welcome-dots" aria-hidden="true">
          {slides.map((_, i) => (
            <span key={i} className={`dot${i === index ? ' active' : ''}`} />
          ))}
        </div>

        <button className="welcome-btn welcome-btn-primary" onClick={handleNext}>
          {isLast ? 'ابدأ الآن' : 'التالي'}
        </button>

        <button
          className="welcome-btn welcome-btn-secondary"
          onClick={handlePrev}
          disabled={index === 0}
        >
          السابق
        </button>
      </div>
    </div>
  )
}

export default WelcomePage