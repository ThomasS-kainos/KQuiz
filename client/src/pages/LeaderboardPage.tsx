type LeaderboardTeam = {
  id: string
  name: string
  correctAnswers: number
  incorrectAnswers: number
}

type LeaderboardPageProps = {
  status: string
  leaderboard: LeaderboardTeam[]
}

export function LeaderboardPage({ status, leaderboard }: LeaderboardPageProps) {
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