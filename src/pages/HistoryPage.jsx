import Table from '../components/Table'
import Spinner from '../components/Spinner'
import ErrorMessage from '../components/ErrorMessage'

const columns = [
  { key: 'title', label: 'العقد' },
  { key: 'status', label: 'الحالة' },
  { key: 'risk', label: 'الخطورة' },
]

const rows = [
  { id: 1, title: 'عقد إيجار شقة', status: 'تم التحليل', risk: '20/100' },
  { id: 2, title: 'عقد إيجار عقار', status: 'تم التحليل', risk: '45/100' },
]

function HistoryPage() {
  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>سجل العقود</h2>
      <Table columns={columns} rows={rows} />
      <Spinner />
      <ErrorMessage onRetry={() => alert('إعادة المحاولة')} />
    </div>
  )
}

export default HistoryPage
