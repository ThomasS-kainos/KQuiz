import { StringFieldEntry } from '../core/stringFeildEntry'

type TextInputQuestionProps = {
	value: string
	onChange: (value: string) => void
	disabled: boolean
}

export function TextInputQuestion({ value, onChange, disabled }: TextInputQuestionProps) {
	return (
		<StringFieldEntry
			id="answer"
			value={value}
			onChange={onChange}
			required
			disabled={disabled}
			className="string-field-entry--rounded"
			placeholder="Type your answer"
		/>
	)
}
