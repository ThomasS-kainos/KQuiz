import { type FormEvent } from 'react'
import { StringFieldEntry } from '../components/stringFeildEntry'

type QuizPageProps = {
  status: string
  question: string
  answer: string
  result: string
  isAnswerDisabled: boolean
  isResultOnly: boolean
  onAnswerChange: (answer: string) => void
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

  return (
    <main className="lobby-page quiz-page">
      <section className="lobby-panel quiz-panel" aria-labelledby="quiz-title">
        <p className="connection-status">{status}</p>
        <h1 id="quiz-title">Question</h1>

        <section className="question-panel" aria-labelledby="question-title">
          {question ? <p className="question-text">{question}</p> : <p className="empty-state">Waiting for a question.</p>}
        </section>

        {isGraded && answer && <p className="submitted-answer">Your answer: <strong>{answer}</strong></p>}

        {!isResultOnly && question && (
          <form className="join-form answer-form" onSubmit={submitAnswer}>
            <StringFieldEntry
              id="answer"
              value={answer}
              onChange={onAnswerChange}
              required
              disabled={isAnswerDisabled}
              className="string-field-entry--rounded"
              placeholder="Type your answer"
            />

            <button type="submit" className="join-button" disabled={isAnswerDisabled}>Submit answer</button>
          </form>
        )}

        {result && <p className={resultClassName} role="status">{result}</p>}
      </section>
    </main>
  )
}