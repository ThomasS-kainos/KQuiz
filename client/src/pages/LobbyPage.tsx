import { ConnectionPill } from '../components/core/connectionPill'
import { TeamIcon } from '../components/icons/teamIcon'

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
        <ConnectionPill status={status} />
        <h1 id="lobby-title">Quiz Lobby</h1>

        <section className="teams-panel" aria-labelledby="teams-title">
          <h2 id="teams-title">Teams</h2>
          {teams.length > 0 ? (
            <ul className="teams-list">
              {teams.map((team) => (
                <li key={team.id}>
                  <TeamIcon icon={team.teamIcon} label={team.name} size="medium" /> {team.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-state">No teams have joined yet.</p>
          )}
        </section>

        {myTeamId ? (
          <section className="joined-panel" aria-label="Your team">
            <div className="joined-identity">
              <TeamIcon icon={myTeamIcon} label={myTeamName} size="medium" />
              <p>
                You are <strong>{myTeamName || 'Joined'}</strong>
              </p>
            </div>
            <button type="button" className="leave-button" aria-label="Leave" onClick={() => void onLeave()}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </section>
        ) : (
          <p className="empty-state">
            You haven't joined a team yet. Go back to the <a href="/">home page</a> to join.
          </p>
        )}
      </section>
    </main>
  )
}