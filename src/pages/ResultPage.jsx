import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { addNotification } from '../Services/notifications'
import './ResultPage.css'

const risks = [
  {
    level: 'مرتفع',
    type: 'high',
    title: 'عدم تحديد حد للمسؤولية',
    description:
      'لا يظهر في العقد سقف واضح لقيمة التعويضات، مما قد يزيد حجم الالتزامات عند حدوث مطالبة.',
    clause: 'بند تحديد المسؤولية',
  },
  {
    level: 'متوسط',
    type: 'medium',
    title: 'ملكية المخرجات غير واضحة',
    description:
      'يحتاج العقد إلى توضيح متى تنتقل ملكية الأعمال والمخرجات إلى العميل.',
    clause: 'بند الملكية الفكرية',
  },
  {
    level: 'متوسط',
    type: 'medium',
    title: 'لا توجد تفاصيل للتأخر في السداد',
    description:
      'لم تُذكر رسوم أو إجراءات واضحة في حال تأخر دفع الفواتير.',
    clause: 'بند الأتعاب والدفع',
  },
]

const clauses = [
  {
    number: '١',
    title: 'مدة العقد وإنهاؤه',
    text: 'مدة أولية ستة أشهر، ويحق لأي طرف إنهاء العقد بإشعار كتابي قبل ٣٠ يومًا.',
    status: 'واضح',
    type: 'safe',
  },
  {
    number: '٢',
    title: 'الأتعاب والدفع',
    text: 'أتعاب شهرية قدرها ٨٬٥٠٠ دولار. لا يوضح العقد الإجراء المتبع عند التأخر في الدفع.',
    status: 'يحتاج مراجعة',
    type: 'medium',
  },
  {
    number: '٣',
    title: 'السرية',
    text: 'يلتزم الطرفان بالحفاظ على سرية المعلومات خلال مدة التعاقد.',
    status: 'واضح',
    type: 'safe',
  },
  {
    number: '٤',
    title: 'الملكية الفكرية',
    text: 'لا يحدد النص بوضوح آلية انتقال ملكية المخرجات بعد سداد المستحقات.',
    status: 'يحتاج مراجعة',
    type: 'medium',
  },
  {
    number: '٥',
    title: 'تحديد المسؤولية',
    text: 'لم يتم العثور على حد أقصى واضح للمسؤولية أو استثناء للأضرار غير المباشرة.',
    status: 'مخاطر مرتفعة',
    type: 'high',
  },
]

const references = [
  {
    title: 'تحديد المسؤولية',
    text: 'مفهوم تعاقدي يوضح حدود المسؤولية والتعويضات المحتملة بين الأطراف.',
  },
  {
    title: 'التنازل عن الملكية الفكرية',
    text: 'يوضح كيفية انتقال حقوق الأعمال والمخرجات إلى الطرف المستفيد.',
  },
  {
    title: 'شروط الدفع والتأخر',
    text: 'تتضمن مواعيد استحقاق الفواتير والإجراءات المرتبطة بالتأخر في السداد.',
  },
]

function ResultsPage() {
  const { state } = useLocation()
  const fileName = state?.fileName || 'ملف العقد'

  useEffect(() => {
    addNotification(`اكتمل تحليل العقد "${fileName}" بنجاح.`)
  }, [fileName])

  return (
    <main className="analysis-results" dir="rtl">
      <header className="results-header">
        <p className="results-eyebrow">LegalLens AI · نتائج التحليل</p>
        <h1>ملخص تحليل العقد</h1>
        <p>راجعي أهم البنود والتنبيهات التي تم رصدها في العقد.</p>
      </header>

      <section className="results-file">
        <div className="results-file-icon">PDF</div>
        <div className="results-file-name">
          <strong>{fileName}</strong>
          <span>عقد خدمات استشارية · ١٢ صفحة</span>
        </div>
        <span className="results-complete">اكتمل التحليل</span>
      </section>

      <section className="results-top-grid">
        <article className="results-card summary-card">
          <div className="results-card-heading">
            <h2>الملخص</h2>
            <span>نظرة عامة</span>
          </div>

          <p className="summary-text">
            ينظم العقد تقديم خدمات استشارية لمدة ستة أشهر مقابل أتعاب شهرية.
            يتضمن بنودًا للسرية وإنهاء التعاقد، لكن بعض التفاصيل المتعلقة
            بالمسؤولية وملكية المخرجات والتأخر في السداد تحتاج إلى مراجعة.
          </p>

          <div className="summary-facts">
            <div>
              <strong>٦ أشهر</strong>
              <span>مدة العقد</span>
            </div>
            <div>
              <strong>٨٬٥٠٠ $</strong>
              <span>الأتعاب الشهرية</span>
            </div>
            <div>
              <strong>٣٠ يومًا</strong>
              <span>مدة الإشعار</span>
            </div>
          </div>
        </article>

        <article className="results-card score-card">
          <div className="results-card-heading">
            <h2>مستوى المخاطر</h2>
            <span className="risk-label">متوسط</span>
          </div>

          <div className="score-content">
            <div className="score-circle">
              <span>٦٨</span>
            </div>
            <div>
              <strong>يحتاج إلى مراجعة</strong>
              <p>تم رصد ٣ نقاط تستحق الانتباه قبل التوقيع.</p>
            </div>
          </div>

          <div className="score-legend">
            <span>
              <i className="dot high-dot" /> مرتفع: ١
            </span>
            <span>
              <i className="dot medium-dot" /> متوسط: ٢
            </span>
          </div>
        </article>
      </section>

      <section className="results-card risks-section">
        <div className="results-card-heading">
          <h2>بطاقات المخاطر</h2>
          <span>٣ نقاط للمراجعة</span>
        </div>

        <div className="risk-list">
          {risks.map((risk) => (
            <article className="risk-item" key={risk.title}>
              <span className={`risk-badge ${risk.type}`}>{risk.level}</span>
              <div>
                <h3>{risk.title}</h3>
                <p>{risk.description}</p>
                <small>{risk.clause}</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="results-card clauses-section">
        <div className="results-card-heading">
          <h2>البنود الرئيسية</h2>
          <span>{clauses.length} بنود</span>
        </div>

        <div className="clause-list">
          {clauses.map((clause) => (
            <article className="clause-item" key={clause.number}>
              <span className="clause-number">{clause.number}</span>
              <div className="clause-content">
                <h3>{clause.title}</h3>
                <p>{clause.text}</p>
              </div>
              <span className={`clause-status ${clause.type}`}>
                {clause.status}
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="results-card references-section">
        <div className="results-card-heading">
          <h2>مراجع ومفاهيم قانونية</h2>
          <span>للاسترشاد</span>
        </div>

        <div className="reference-list">
          {references.map((reference) => (
            <article className="reference-item" key={reference.title}>
              <span className="reference-icon">§</span>
              <div>
                <h3>{reference.title}</h3>
                <p>{reference.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <p className="results-disclaimer">
        هذه النتائج استرشادية ولا تُعد استشارة قانونية. يُرجى مراجعة محامٍ
        مختص، كما أن البيانات المعروضة تجريبية ويمكن استبدالها بنتيجة الـBackend.
      </p>
    </main>
  )
}

export default ResultsPage
