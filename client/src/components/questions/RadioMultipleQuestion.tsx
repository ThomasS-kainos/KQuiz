import type { MultipleChoiceQuestion } from '../../types/questions'

type RadioMultipleQuestionProps = {
	question: MultipleChoiceQuestion
	value: string[]
	onChange: (value: string[]) => void
	disabled: boolean
}

export function RadioMultipleQuestion({ question, value, onChange, disabled }: RadioMultipleQuestionProps) {
	function toggleOption(option: string) {
		const isSelected = value.includes(option)
		onChange(isSelected ? value.filter((item) => item !== option) : [...value, option])
	}

	return (
		<div className="option-list" role="group">
			{question.options.map((option) => (
				<label key={option} className={`option-item${value.includes(option) ? ' option-item--selected' : ''}`}>
					<input
						type="checkbox"
						value={option}
						checked={value.includes(option)}
						disabled={disabled}
						onChange={() => toggleOption(option)}
					/>
					{option}
				</label>
			))}
		</div>
	)
}
