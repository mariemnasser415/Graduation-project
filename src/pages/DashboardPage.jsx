import { Link } from 'react-router-dom'
import Card from '../components/Card'
import './DashboardPage.css'

// بيانات تجريبية لحد ما الـ Backend يجهز
const recentContracts = [
  { id: 1, title: 'عقد إيجار شقة', status: 'تم التحليل', risk: 20 },
]

function DashboardPage() {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h2>مرحباً بك</h2>
        <p>ماذا تريد أن تفعل اليوم؟</p>
      </header>

      <div className="actions">
        <Link to="/analyze" className="action-card action-primary">
          <h3>رفع عقد وتحليله</h3>
          <p>اكتشف البنود الخطرة وغير العادلة في ثوانٍ</p>
        </Link>

        <Link to="/create" className="action-card">
          <h3>إنشاء عقد</h3>
          <p>إيجار عقار أو شقة أو مفروش بخطوات بسيطة</p>
        </Link>
      </div>

      <section>
        <div className="section-head">
          <h3>آخر العقود</h3>
          <Link to="/history">عرض الكل</Link>
        </div>

        {recentContracts.map((contract) => (
          <Card key={contract.id}>
            <div className="contract-row">
              <div>
                <strong>{contract.title}</strong>
                <p className="muted">{contract.status}</p>
              </div>
              <span className="risk-badge">خطورة {contract.risk}/100</span>
            </div>
          </Card>
        ))}
      </section>
    </div>
  )
}

export default DashboardPage
