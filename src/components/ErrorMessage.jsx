import Button from './Button'
import './ErrorMessage.css'

function ErrorMessage({ message = 'حدث خطأ، حاول مرة أخرى', onRetry }) {
  return (
    <div className="error-box">
      <p>{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          إعادة المحاولة
        </Button>
      )}
    </div>
  )
}

export default ErrorMessage
