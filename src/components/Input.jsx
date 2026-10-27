import './Input.css'

function Input({ label, ...props }) {
  return (
    <label className="field">
      {label && <span className="field-label">{label}</span>}
      <input className="field-input" {...props} />
    </label>
  )
}

export default Input
