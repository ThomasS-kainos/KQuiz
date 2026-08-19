import { LobbyPage } from './pages/LobbyPage'
import { LeaderboardPage } from './pages/LeaderboardPage'
import { QuizPage } from './pages/QuizPage'
import './App.css'

function App() {
  if (window.location.pathname === '/leaderboard') {
    return <LeaderboardPage />
  }

  if (window.location.pathname === '/quiz') {
    return <QuizPage />
  }

  return <LobbyPage />
}

export default App
