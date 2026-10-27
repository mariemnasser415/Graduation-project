import './Spinner.css'

function Spinner({ text = 'جارٍ التحميل...' }) {
  return (
    <div className="spinner-wrap">
      <div className="spinner" />
      <p>{text}</p>
    </div>
  )
}

export default Spinner
