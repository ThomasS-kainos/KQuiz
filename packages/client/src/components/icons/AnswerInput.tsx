import { TextInputQuestion } from '../questions/TextInputQuestion'
import type { AnswerValue, QuestionData } from '../../types/questions'

type AnswerInputProps = {
  question: QuestionData
  value: AnswerValue
  onChange: (value: AnswerValue) => void
  disabled: boolean
}

// Renders the right input control for a question's type, keeping that logic out of QuizPage.
export function AnswerInput({ question, value, onChange, disabled }: AnswerInputProps) {
  if (question.type === 'single-choice') {
    const selected = typeof value === 'string' ? value : ''

    return (
      <div className="option-list" role="radiogroup">
        {question.options.map((option) => (
          <label key={option} className={`option-item${selected === option ? ' option-item--selected' : ''}`}>
            <input
              type="radio"
              name="answer"
              value={option}
              checked={selected === option}
              disabled={disabled}
              onChange={() => onChange(option)}
            />
            {option}
          </label>
        ))}
      </div>
    )
  }

  if (question.type === 'multiple-choice') {
    const selected = Array.isArray(value) ? value : []

    function toggleOption(option: string) {
      const isSelected = selected.includes(option)
      onChange(isSelected ? selected.filter((item) => item !== option) : [...selected, option])
    }

    return (
      <div className="option-list" role="group">
        {question.options.map((option) => (
          <label key={option} className={`option-item${selected.includes(option) ? ' option-item--selected' : ''}`}>
            <input
              type="checkbox"
              value={option}
              checked={selected.includes(option)}
              disabled={disabled}
              onChange={() => toggleOption(option)}
            />
            {option}
          </label>
        ))}
      </div>
    )
  }

  const textValue = typeof value === 'string' ? value : ''

  return (
    <TextInputQuestion
      value={textValue}
      onChange={onChange}
      disabled={disabled}
    />
  )
}
