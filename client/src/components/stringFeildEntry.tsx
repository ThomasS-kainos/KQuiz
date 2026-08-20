type StringFieldEntryProps = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  maxLength?: number
  autoComplete?: string
  required?: boolean
  className?: string
}

export function StringFieldEntry({
  id,
  label,
  value,
  onChange,
  maxLength,
  autoComplete = 'off',
  required,
  className = '',
}: StringFieldEntryProps) {
  return (
    <div className={`string-field-entry ${className}`.trim()}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        maxLength={maxLength}
        required={required}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}
