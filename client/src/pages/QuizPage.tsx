import { type FormEvent } from 'react'

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

  return (
    <main className="lobby-page quiz-page">
      <section className="lobby-panel quiz-panel" aria-labelledby="quiz-title">
        {!isResultOnly && <p className="connection-status">{status}</p>}
        {!isResultOnly && <h1 id="quiz-title">Question</h1>}

        {!isResultOnly && (
          <section className="question-panel" aria-labelledby="question-title">
            {question ? <p className="question-text">{question}</p> : <p className="empty-state">Waiting for a question.</p>}
          </section>
        )}

        {!isResultOnly && question && (
          <form className="join-form answer-form" onSubmit={submitAnswer}>
            <label htmlFor="answer">Answer</label>
            <div className="join-row">
              <input
                id="answer"
                type="text"
                required
                autoComplete="off"
                value={answer}
                disabled={isAnswerDisabled}
                onChange={(event) => onAnswerChange(event.target.value)}
              />
              <button type="submit" disabled={isAnswerDisabled}>Submit answer</button>
            </div>
          </form>
        )}

        {result && <p className="result-panel" role="status">{result}</p>}
      </section>
    </main>
  )
}