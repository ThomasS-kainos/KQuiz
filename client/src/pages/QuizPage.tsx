import { type FormEvent } from 'react'
import { AnswerInput } from '../components/AnswerInput'
import { ConnectionPill } from '../components/core/connectionPill'
import type { AnswerValue, QuestionData } from '../types/questions'

type QuizPageProps = {
  status: string
  question: QuestionData | null
  answer: AnswerValue
  result: string
  isAnswerDisabled: boolean
  isResultOnly: boolean
  onAnswerChange: (answer: AnswerValue) => void
  onSubmitAnswer: () => Promise<void>
}

export function QuizPage({ status, question, answer, result, isAnswerDisabled, isResultOnly, onAnswerChange, onSubmitAnswer }: QuizPageProps) {
  async function submitAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onSubmitAnswer()
  }

  const isGraded = result === 'Correct' || result === 'Incorrect'
  const resultVariant = isGraded ? (result === 'Correct' ? 'correct' : 'incorrect') : result === 'Answer submitted' ? 'submitted' : undefined
  const resultClassName = ['result-panel', resultVariant && `result-panel--${resultVariant}`].filter(Boolean).join(' ')
  const submittedAnswerText = Array.isArray(answer) ? answer.join(', ') : answer

  return (
    <main className="lobby-page quiz-page">
      <section className="lobby-panel quiz-panel" aria-labelledby="quiz-title">
        <ConnectionPill status={status} />
        <h1 id="quiz-title">Question</h1>

        <section className="question-panel" aria-labelledby="question-title">
          {question ? (
            <>
              <p className="question-text">{question.question}</p>
              <p className="question-type-hint">
                {question.type === 'multiple-choice' ? 'Select all that apply' : question.type === 'single-choice' ? 'Select one answer' : 'Type your answer'}
              </p>
            </>
          ) : (
            <p className="empty-state">Waiting for a question.</p>
          )}
        </section>

        {isGraded && submittedAnswerText && <p className="submitted-answer">Your answer: <strong>{submittedAnswerText}</strong></p>}

        {!isResultOnly && question && (
          <form className="join-form answer-form" onSubmit={submitAnswer}>
            <AnswerInput question={question} value={answer} onChange={onAnswerChange} disabled={isAnswerDisabled} />

            <button type="submit" className="join-button" disabled={isAnswerDisabled}>Submit answer</button>
          </form>
        )}

        {result && <p className={resultClassName} role="status">{result}</p>}
      </section>
    </main>
  )
}
