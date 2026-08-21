import { useEffect, useRef, useState } from 'react'
import { type ServerMessage } from './websocket'
import { api } from '../constants/api'

type Team = {
  id: string
  name: string
  teamIcon: string
}

type LeaderboardTeam = {
  id: string
  name: string
  teamIcon: string
  correctAnswers: number
  incorrectAnswers: number
}

export function useGameState() {
  const [path, setPath] = useState(window.location.pathname)
  const [apiStatus, setApiStatus] = useState('')
  const [myTeamId, setMyTeamId] = useState(() => sessionStorage.getItem('teamID'))
  const [myTeamName, setMyTeamName] = useState('')
  const [myTeamIcon, setMyTeamIcon] = useState('')
  const [teams, setTeams] = useState<Team[]>([])
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState('')
  const [isAnswerDisabled, setIsAnswerDisabled] = useState(false)
  const [isResultOnly, setIsResultOnly] = useState(false)
  const [leaderboard, setLeaderboard] = useState<LeaderboardTeam[]>([])
  const submittedAnswerRef = useRef<string | null>(null)

  function navigate(nextPath: string) {
    if (window.location.pathname !== nextPath) {
      window.history.pushState(null, '', nextPath)
    }

    setApiStatus('')
    setPath(nextPath)
  }

  function handlePopState() {
    setPath(window.location.pathname)
  }

  // Set up popstate listener on mount
  useEffect(() => {
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  async function loadTeams() {
    const response = await fetch(`${api.RootURL}/lobby/teams`)

    if (!response.ok) {
      throw new Error('Failed to load teams')
    }

    const loadedTeams = await response.json() as Team[]
    setTeams(loadedTeams)
  }

  async function joinLobby(teamName: string, teamIcon: string) {
    const response = await fetch(`${api.RootURL}/lobby/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamName, teamIcon }),
    })

    if (!response.ok) {
      setApiStatus('Failed to join')
      return
    }

    const data = await response.json() as { uuid: string; message: string }
    setApiStatus('')
    setMyTeamId(data.uuid)
    setMyTeamName(teamName)
    setMyTeamIcon(teamIcon)
    sessionStorage.setItem('teamID', data.uuid)
    await loadTeams()
    navigate('/lobby')
  }

  async function leaveLobby() {
    if (!myTeamId) {
      return
    }

    await fetch(`${api.RootURL}/lobby/leave`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamId: myTeamId }),
    })

    setApiStatus('')
    setMyTeamId(null)
    setMyTeamName('')
    setMyTeamIcon('')
    sessionStorage.removeItem('teamID')
    await loadTeams()
    navigate('/')
  }

  async function loadCurrentQuestion() {
    const response = await fetch(`${api.RootURL}/game/current-question`)

    if (!response.ok) {
      setApiStatus('Failed to load question')
      return
    }

    const currentQuestion = await response.json() as { question: string }
    setApiStatus('')
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

    return response.json() as Promise<{ answer: string }>
  }

  function showResultOnly(message: string) {
    setIsResultOnly(true)
    setResult(message)
  }

  async function submitAnswer() {
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

  async function loadLeaderboard() {
    const response = await fetch(`${api.RootURL}/game/leaderboard`)

    if (!response.ok) {
      setApiStatus('Failed to load leaderboard')
      return
    }

    const data = await response.json() as { leaderboard: LeaderboardTeam[] }
    setLeaderboard(data.leaderboard)
    setApiStatus(data.leaderboard.length > 0 ? 'Current standings' : 'No teams yet')
  }

  function handleWebSocketMessage(message: ServerMessage) {
    if (message.type === 'teams-update') {
      void loadTeams().catch(() => {
        setApiStatus('Failed to load teams')
      })
    }

    if (message.type === 'start-game' || message.type === 'next-question') {
      void loadCurrentQuestion()
      navigate('/quiz')
    }

    if (message.type === 'show-answer' && submittedAnswerRef.current !== null) {
      void loadCurrentAnswer()
        .then(({ answer: currentAnswer }) => {
          const submittedAnswer = submittedAnswerRef.current ?? ''
          const isCorrect = submittedAnswer.trim().toLowerCase() === currentAnswer.trim().toLowerCase()
          showResultOnly(isCorrect ? 'Correct' : 'Incorrect')
        })
        .catch((error: Error) => {
          setApiStatus(error.message)
        })
    }

    if (message.type === 'show-leaderboard') {
      void loadLeaderboard()
      navigate('/leaderboard')
    }
  }

  return {
    // State
    path,
    apiStatus,
    myTeamId,
    myTeamName,
    myTeamIcon,
    teams,
    question,
    answer,
    result,
    isAnswerDisabled,
    isResultOnly,
    leaderboard,
    // Actions
    navigate,
    loadTeams,
    loadLeaderboard,
    joinLobby,
    leaveLobby,
    loadCurrentQuestion,
    submitAnswer,
    handleWebSocketMessage,
    // Setters
    setAnswer,
  }
}
