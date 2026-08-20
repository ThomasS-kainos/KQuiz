type StringFieldEntryProps = {
  id: string
  value: string
  onChange: (value: string) => void
  maxLength?: number
  autoComplete?: string
  required?: boolean
  disabled?: boolean
  className?: string
  placeholder?: string
}

export function StringFieldEntry({
  id,
  value,
  onChange,
  maxLength,
  autoComplete = 'off',
  required,
  disabled,
  className = '',
  placeholder,
}: StringFieldEntryProps) {
  return (
    <div className={`string-field-entry ${className}`.trim()}>
      <input
        id={id}
        maxLength={maxLength}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}
