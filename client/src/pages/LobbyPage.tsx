import { type FormEvent, useState } from 'react'

type Team = {
  id: string
  name: string
}

type LobbyPageProps = {
  status: string
  teamName: string
  myTeamId: string | null
  myTeamName: string
  teams: Team[]
  onJoin: (teamName: string) => Promise<void>
  onLeave: () => Promise<void>
}

export function LobbyPage({ status, teamName, myTeamId, myTeamName, teams, onJoin, onLeave }: LobbyPageProps) {
  const [draftTeamName, setDraftTeamName] = useState(teamName)

  async function joinLobby(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onJoin(draftTeamName)
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
                value={draftTeamName}
                onChange={(event) => setDraftTeamName(event.target.value)}
              />
              <button type="submit">Join</button>
            </div>
          </form>
        ) : (
          <section className="joined-panel" aria-label="Your team">
            <p>
              You are <strong>{myTeamName || 'Joined'}</strong>
            </p>
            <button type="button" onClick={() => void onLeave()}>Leave</button>
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