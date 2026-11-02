import { useEffect, useRef, useState } from 'react'
import './ContractUploadPage.css'

const MAX_FILE_SIZE = 10 * 1024 * 1024

function ContractUploadPage({ onAnalyze }) {
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')

  const inputRef = useRef(null)

  const isPdf = file
    ? file.type === 'application/pdf' || /\.pdf$/i.test(file.name)
    : false

  const isTxt = file
    ? file.type === 'text/plain' || /\.txt$/i.test(file.name)
    : false

  const canPreview = isPdf || isTxt

  useEffect(() => {
    if (!file || !canPreview) {
      setPreviewUrl('')
      return undefined
    }

    // بعض المتصفحات لا تعرض TXT إذا كان نوع الملف غير محدد،
    // لذلك ننشئ نسخة معاينة بنوع text/plain.
    const previewFile = isTxt
      ? new Blob([file], { type: 'text/plain' })
      : file

    const url = URL.createObjectURL(previewFile)
    setPreviewUrl(url)

    return () => URL.revokeObjectURL(url)
  }, [file, canPreview, isTxt])

  function selectFile(selectedFile) {
    if (!selectedFile) return

    setError('')
    setNotice('')

    const hasSupportedExtension = /\.(pdf|docx|txt)$/i.test(
      selectedFile.name,
    )

    if (!hasSupportedExtension) {
      setFile(null)
      setError('نوع الملف غير مدعوم. اختر ملف PDF أو DOCX أو TXT.')
      return
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setFile(null)
      setError('حجم الملف أكبر من 10 ميجابايت. اختر ملفًا أصغر.')
      return
    }

    setFile(selectedFile)
  }

  function handleDrop(event) {
    event.preventDefault()
    setIsDragging(false)
    selectFile(event.dataTransfer.files?.[0])
  }

  async function handleAnalyze() {
    if (!file || isAnalyzing) return

    setError('')
    setNotice('')

    // تمرر مي دالة onAnalyze عند ربط الصفحة بالـBackend.
    if (!onAnalyze) {
      setNotice(
        'الملف جاهز للتحليل. سيتم إرساله إلى الـBackend عند ربط الخدمة.',
      )
      return
    }

    try {
      setIsAnalyzing(true)
      await onAnalyze(file)
    } catch (err) {
      setError(err.message || 'تعذر تحليل الملف. حاول مرة أخرى.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  function removeFile() {
    setFile(null)
    setError('')
    setNotice('')

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <main className="contract-upload-page" dir="rtl">
      <header className="upload-page-header">
        <p className="upload-eyebrow">LegalLens AI</p>
        <h1>ارفع عقدك وحلّله</h1>
        <p className="upload-description">
          ارفع نسخة العقد لمراجعة البنود واكتشاف النقاط التي تستحق انتباهك.
        </p>
      </header>

      <section className="upload-card">
        <div className="upload-section-title">
          <span className="upload-step">١</span>
          <div>
            <h2>اختيار ملف العقد</h2>
            <p>الصيغ المدعومة PDF وDOCX وTXT، بحد أقصى 10 ميجابايت</p>
          </div>
        </div>

        <input
          ref={inputRef}
          className="upload-file-input"
          type="file"
          accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          onChange={(event) => selectFile(event.target.files?.[0])}
        />

        <div
          className={`upload-dropzone ${isDragging ? 'is-dragging' : ''}`}
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              inputRef.current?.click()
            }
          }}
          onDragOver={(event) => {
            event.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div className="upload-cloud-icon" aria-hidden="true">
            ↑
          </div>

          <strong>اسحب الملف وأفلته هنا</strong>
          <span className="upload-or">أو</span>

          <button
            className="upload-browse-button"
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              inputRef.current?.click()
            }}
          >
            تصفّح الملفات
          </button>

          <small>PDF أو DOCX أو TXT · حتى 10 ميجابايت</small>
        </div>

        {file && (
          <div className="upload-selected-file">
            <div className="upload-file-badge">
              {isPdf ? 'PDF' : isTxt ? 'TXT' : 'DOCX'}
            </div>

            <div className="upload-file-info">
              <strong>{file.name}</strong>
              <span>
                {(file.size / (1024 * 1024)).toFixed(2)} ميجابايت
              </span>
            </div>

            <button
              className="upload-remove-button"
              type="button"
              onClick={removeFile}
            >
              إزالة
            </button>
          </div>
        )}

        {file && canPreview && previewUrl && (
          <div className="upload-preview">
            <div className="upload-preview-header">
              <strong>معاينة العقد</strong>
              <a href={previewUrl} target="_blank" rel="noreferrer">
                فتح الملف في نافذة جديدة ↗
              </a>
            </div>

            <iframe
              className="upload-pdf-frame"
              src={previewUrl}
              title={`معاينة ${file.name}`}
            />
          </div>
        )}

        {file && !canPreview && (
          <div className="upload-docx-note">
            تم اختيار ملف Word. ستظهر المعاينة بعد إرساله إلى خدمة التحليل.
          </div>
        )}

        {error && (
          <div className="upload-message upload-error" role="alert">
            {error}
          </div>
        )}

        {notice && (
          <div className="upload-message upload-success" role="status">
            {notice}
          </div>
        )}

        <div className="upload-submit-area">
          <button
            className="upload-analyze-button"
            type="button"
            disabled={!file || isAnalyzing}
            onClick={handleAnalyze}
          >
            {isAnalyzing ? 'جارٍ تحليل العقد...' : 'ابدأ التحليل'}
            {!isAnalyzing && <span aria-hidden="true">←</span>}
          </button>

          <p>تأكد من اختيار نسخة واضحة وكاملة من العقد.</p>
        </div>
      </section>
    </main>
  )
}

export default ContractUploadPage