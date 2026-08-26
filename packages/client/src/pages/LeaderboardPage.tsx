import { ConnectionPill } from '../components/core/connectionPill'
import { TeamIcon } from '../components/icons/teamIcon'

type LeaderboardTeam = {
  id: string
  name: string
  teamIcon: string
  correctAnswers: number
  incorrectAnswers: number
}

type LeaderboardPageProps = {
  status: string
  leaderboard: LeaderboardTeam[]
  myTeamId: string | null
}

const RANK_LABELS = ['1st', '2nd', '3rd']
const RANK_CLASSES = ['leaderboard-rank--gold', 'leaderboard-rank--silver', 'leaderboard-rank--bronze']

export function LeaderboardPage({ status, leaderboard, myTeamId }: LeaderboardPageProps) {
  const ranked = [...leaderboard].sort((a, b) =>
    b.correctAnswers - a.correctAnswers || a.incorrectAnswers - b.incorrectAnswers
  )
  const topTeams = ranked.slice(0, 3)
  const myTeam = ranked.find((team) => team.id === myTeamId)

  return (
    <main className="lobby-page leaderboard-page">
      <section className="lobby-panel leaderboard-panel" aria-labelledby="leaderboard-title">
        <ConnectionPill status={status} />
        <h1 id="leaderboard-title">Leaderboard</h1>

        <section className="teams-panel" aria-labelledby="leaderboard-list-title">
          <h2 id="leaderboard-list-title">Top Teams</h2>
          {topTeams.length > 0 ? (
            <ol className="teams-list leaderboard-list">
              {topTeams.map((team, index) => (
                <li key={team.id}>
                  <span className={`leaderboard-rank ${RANK_CLASSES[index]}`}>{RANK_LABELS[index]}</span>
                  <TeamIcon icon={team.teamIcon} label={team.name} size="medium" />
                  <span className="leaderboard-team-name">{team.name}</span>
                  <span className="leaderboard-score">{team.correctAnswers} pts</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="empty-state">No teams yet.</p>
          )}
        </section>
      </section>

      {myTeam && (
        <section className="joined-panel my-team-score" aria-label="Your score">
          <div className="joined-identity">
            <TeamIcon icon={myTeam.teamIcon} label={myTeam.name} size="medium" />
            <p>
              You are <strong>{myTeam.name}</strong>
            </p>
          </div>
          <span className="score-badge" aria-label={`${myTeam.correctAnswers} points`}>
            {myTeam.correctAnswers} pts
          </span>
        </section>
      )}
    </main>
  )
}