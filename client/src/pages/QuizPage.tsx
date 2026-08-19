import { type FormEvent, useEffect, useRef, useState } from 'react'

import { api } from '../api'

type ServerMessage = {
  type: string
}

type CurrentQuestionResponse = {
  question: string
}

type CurrentAnswerResponse = {
  answer: string
}

function getWebSocketUrl() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const host = import.meta.env.DEV ? `${window.location.hostname}:3000` : window.location.host

  return `${protocol}//${host}`
}

export function QuizPage() {
  const [status, setStatus] = useState('Connecting...')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState('')
  const [isAnswerDisabled, setIsAnswerDisabled] = useState(false)
  const [isResultOnly, setIsResultOnly] = useState(false)
  const submittedAnswerRef = useRef<string | null>(null)

  async function loadCurrentQuestion() {
    const response = await fetch(`${api.RootURL}/game/current-question`)

    if (!response.ok) {
      throw new Error('Failed to load question')
    }

    const currentQuestion = await response.json() as CurrentQuestionResponse
    setQuestion(currentQuestion.question)
    setAnswer('')
    setResult('')
    setIsAnswerDisabled(false)
    setIsResultOnly(false)
    submittedAnswerRef.current = null
  }

  async function loadCurrentAnswer() {
    const response = await fetch(`${api.RootURL}/game/current-answer`)

    if (!response.ok) {
      throw new Error('Failed to load answer')
    }

    return response.json() as Promise<CurrentAnswerResponse>
  }

  function showResultOnly(message: string) {
    setIsResultOnly(true)
    setResult(message)
  }

  useEffect(() => {
    localStorage.removeItem('teamID')
  }, [])

  useEffect(() => {
    let reconnectTimer: number | undefined
    let isActive = true
    let socket: WebSocket | undefined

    function connect() {
      socket = new WebSocket(getWebSocketUrl())

      socket.onopen = () => {
        setStatus('Connected')

        void loadCurrentQuestion().catch((error: Error) => {
          setStatus(error.message)
        })
      }

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data) as ServerMessage

        if (message.type === 'next-question') {
          void loadCurrentQuestion().catch((error: Error) => {
            setStatus(error.message)
          })
        }

        if (message.type === 'show-answer' && submittedAnswerRef.current !== null) {
          void loadCurrentAnswer()
            .then(({ answer: currentAnswer }) => {
              const submittedAnswer = submittedAnswerRef.current ?? ''
              const isCorrect = submittedAnswer.trim().toLowerCase() === currentAnswer.trim().toLowerCase()
              showResultOnly(isCorrect ? 'Correct' : 'Incorrect')
            })
            .catch((error: Error) => {
              setStatus(error.message)
            })
        }

        if (message.type === 'show-leaderboard') {
          window.location.href = '/leaderboard'
        }
      }

      socket.onclose = () => {
        if (!isActive) {
          return
        }

        setStatus('Disconnected - reconnecting...')
        reconnectTimer = window.setTimeout(connect, 2000)
      }
    }

    connect()

    return () => {
      isActive = false
      window.clearTimeout(reconnectTimer)
      socket?.close()
    }
  }, [])

  async function submitAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const teamID = sessionStorage.getItem('teamID')

    if (!teamID) {
      setResult('Join a team before submitting an answer')
      return
    }

    const response = await fetch(`${api.RootURL}/game/submit-answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        teamID,
      },
      body: JSON.stringify({ answer }),
    })

    if (!response.ok) {
      setResult('Failed to submit answer')
      return
    }

    submittedAnswerRef.current = answer
    showResultOnly('Answer submitted')
    setIsAnswerDisabled(true)
  }

  return (
    <main className="lobby-page quiz-page">
      <section className="lobby-panel quiz-panel" aria-labelledby="quiz-title">
        {!isResultOnly && <p className="connection-status">{status}</p>}
        {!isResultOnly && <h1 id="quiz-title">Quiz</h1>}

        {!isResultOnly && (
          <section className="question-panel" aria-labelledby="question-title">
            <h2 id="question-title">Question</h2>
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
                onChange={(event) => setAnswer(event.target.value)}
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