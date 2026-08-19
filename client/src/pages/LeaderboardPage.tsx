import { useEffect, useState } from 'react'

import { api } from '../api'

type ServerMessage = {
  type: string
}

type LeaderboardTeam = {
  id: string
  name: string
  correctAnswers: number
  incorrectAnswers: number
}

type LeaderboardResponse = {
  leaderboard: LeaderboardTeam[]
}

function getWebSocketUrl() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const host = import.meta.env.DEV ? `${window.location.hostname}:3000` : window.location.host

  return `${protocol}//${host}`
}

export function LeaderboardPage() {
  const [status, setStatus] = useState('Connecting...')
  const [leaderboard, setLeaderboard] = useState<LeaderboardTeam[]>([])

  async function loadLeaderboard() {
    const response = await fetch(`${api.RootURL}/game/leaderboard`)

    if (!response.ok) {
      throw new Error('Failed to load leaderboard')
    }

    const data = await response.json() as LeaderboardResponse
    setLeaderboard(data.leaderboard)
    setStatus(data.leaderboard.length > 0 ? 'Current standings' : 'No teams yet')
  }

  useEffect(() => {
    let reconnectTimer: number | undefined
    let isActive = true
    let socket: WebSocket | undefined

    function connect() {
      socket = new WebSocket(getWebSocketUrl())

      socket.onopen = () => {
        setStatus('Waiting for leaderboard...')

        void loadLeaderboard().catch((error: Error) => {
          setStatus(error.message)
        })
      }

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data) as ServerMessage

        if (message.type === 'show-leaderboard') {
          void loadLeaderboard().catch((error: Error) => {
            setStatus(error.message)
          })
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

  return (
    <main className="lobby-page leaderboard-page">
      <section className="lobby-panel leaderboard-panel" aria-labelledby="leaderboard-title">
        <p className="connection-status">{status}</p>
        <h1 id="leaderboard-title">Leaderboard</h1>

        {leaderboard.length > 0 ? (
          <ol className="leaderboard-list">
            {leaderboard.map((team) => (
              <li key={team.id}>
                <span className="leaderboard-team-name">{team.name}</span>
                <span className="leaderboard-score">
                  {team.correctAnswers} correct, {team.incorrectAnswers} incorrect
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="empty-state">No teams yet.</p>
        )}
      </section>
    </main>
  )
}