import type { SingleChoiceQuestion } from '../../types/questions'

type RadioSingleQuestionProps = {
	question: SingleChoiceQuestion
	value: string
	onChange: (value: string) => void
	disabled: boolean
}

export function RadioSingleQuestion({ question, value, onChange, disabled }: RadioSingleQuestionProps) {
	return (
		<div className="option-list" role="radiogroup">
			{question.options.map((option) => (
				<label key={option} className={`option-item${value === option ? ' option-item--selected' : ''}`}>
					<input
						type="radio"
						name="answer"
						value={option}
						checked={value === option}
						disabled={disabled}
						onChange={() => onChange(option)}
					/>
					{option}
				</label>
			))}
		</div>
	)
}
