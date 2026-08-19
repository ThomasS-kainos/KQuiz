import { type FormEvent, useEffect, useState } from 'react'

type Team = {
  id: string
  name: string
}

type ServerMessage = {
  type: string
}

type JoinResponse = {
  uuid: string
  message: string
}

function getWebSocketUrl() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const host = import.meta.env.DEV ? `${window.location.hostname}:3000` : window.location.host

  return `${protocol}//${host}`
}

export function LobbyPage() {
  const [status, setStatus] = useState('Connecting...')
  const [teamName, setTeamName] = useState('')
  const [myTeamId, setMyTeamId] = useState(() => sessionStorage.getItem('teamID'))
  const [myTeamName, setMyTeamName] = useState('')
  const [teams, setTeams] = useState<Team[]>([])

  async function loadTeams() {
    const response = await fetch('/lobby/teams')

    if (!response.ok) {
      throw new Error('Failed to load teams')
    }

    const loadedTeams = await response.json() as Team[]
    setTeams(loadedTeams)
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
      }

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data) as ServerMessage

        if (message.type === 'teams-update') {
          void loadTeams().catch(() => {
            setStatus('Failed to load teams')
          })
        }

        if (message.type === 'start-game') {
          window.location.href = '/quiz'
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

  async function joinLobby(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const response = await fetch('/lobby/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamName }),
    })

    if (!response.ok) {
      setStatus('Failed to join')
      return
    }

    const data = await response.json() as JoinResponse
    setMyTeamId(data.uuid)
    setMyTeamName(teamName)
    sessionStorage.setItem('teamID', data.uuid)
    await loadTeams()
  }

  async function leaveLobby() {
    if (!myTeamId) {
      return
    }

    await fetch('/lobby/leave', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamId: myTeamId }),
    })

    setMyTeamId(null)
    setMyTeamName('')
    sessionStorage.removeItem('teamID')
    await loadTeams()
  }

  return (
    <main className="lobby-page">
      <section className="lobby-panel" aria-labelledby="lobby-title">
        <p className="connection-status">{status}</p>
        <h1 id="lobby-title">Quiz Lobby</h1>

        {!myTeamId ? (
          <form className="join-form" onSubmit={joinLobby}>
            <label htmlFor="teamName">Team name</label>
            <div className="join-row">
              <input
                id="teamName"
                maxLength={24}
                required
                autoComplete="off"
                value={teamName}
                onChange={(event) => setTeamName(event.target.value)}
              />
              <button type="submit">Join</button>
            </div>
          </form>
        ) : (
          <section className="joined-panel" aria-label="Your team">
            <p>
              You are <strong>{myTeamName || 'Joined'}</strong>
            </p>
            <button type="button" onClick={leaveLobby}>Leave</button>
          </section>
        )}

        <section className="teams-panel" aria-labelledby="teams-title">
          <h2 id="teams-title">Teams</h2>
          {teams.length > 0 ? (
            <ul className="teams-list">
              {teams.map((team) => (
                <li key={team.id}>{team.name}</li>
              ))}
            </ul>
          ) : (
            <p className="empty-state">No teams have joined yet.</p>
          )}
        </section>
      </section>
    </main>
  )
}