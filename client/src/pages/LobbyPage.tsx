import { TeamIcon } from '../components/teamIcon'

type Team = {
  id: string
  name: string
  teamIcon: string
}

type LobbyPageProps = {
  status: string
  myTeamId: string | null
  myTeamName: string
  myTeamIcon: string
  teams: Team[]
  onLeave: () => Promise<void>
}

export function LobbyPage({ status, myTeamId, myTeamName, myTeamIcon, teams, onLeave }: LobbyPageProps) {
  return (
    <main className="lobby-page">
      <section className="lobby-panel" aria-labelledby="lobby-title">
        <p className="connection-status">{status}</p>
        <h1 id="lobby-title">Quiz Lobby</h1>

        {myTeamId ? (
          <section className="joined-panel" aria-label="Your team">
            <p>
              <TeamIcon icon={myTeamIcon} label={myTeamName} /> You are <strong>{myTeamName || 'Joined'}</strong>
            </p>
            <button type="button" onClick={() => void onLeave()}>Leave</button>
          </section>
        ) : (
          <p className="empty-state">
            You haven't joined a team yet. Go back to the <a href="/">home page</a> to join.
          </p>
        )}

        <section className="teams-panel" aria-labelledby="teams-title">
          <h2 id="teams-title">Teams</h2>
          {teams.length > 0 ? (
            <ul className="teams-list">
              {teams.map((team) => (
                <li key={team.id}>
                  <TeamIcon icon={team.teamIcon} label={team.name} /> {team.name}
                </li>
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