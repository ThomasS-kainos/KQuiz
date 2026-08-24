import { RadioMultipleQuestion } from './RadioMultipleQuestion'
import { RadioSingleQuestion } from './RadioSingleQuestion'
import { TextInputQuestion } from './TextInputQuestion'
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

    return <RadioSingleQuestion question={question} value={selected} onChange={onChange} disabled={disabled} />
  }

  if (question.type === 'multiple-choice') {
    const selected = Array.isArray(value) ? value : []

    return <RadioMultipleQuestion question={question} value={selected} onChange={onChange} disabled={disabled} />
  }

  const textValue = typeof value === 'string' ? value : ''

  return <TextInputQuestion value={textValue} onChange={onChange} disabled={disabled} />
}
