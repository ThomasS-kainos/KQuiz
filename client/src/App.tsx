import { useWebSocket } from './hooks/websocket'
import { useGameState } from './hooks/useGameState'
import { JoinPage } from './pages/JoinPage'
import { LobbyPage } from './pages/LobbyPage'
import { LeaderboardPage } from './pages/LeaderboardPage'
import { QuizPage } from './pages/QuizPage'
import './App.css'

function App() {
  const gameState = useGameState()
  const {
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
    loadLeaderboard,
    joinLobby,
    leaveLobby,
    loadCurrentQuestion,
    submitAnswer,
    handleWebSocketMessage,
    setAnswer,
  } = gameState

  const { status: websocketStatus } = useWebSocket({
    onOpen: () => {
      if (window.location.pathname === '/quiz') {
        void loadCurrentQuestion()
      }

      if (window.location.pathname === '/leaderboard') {
        void loadLeaderboard()
      }
    },
    onMessage: handleWebSocketMessage,
  })
  const status = apiStatus || websocketStatus

  function renderPage() {
    if (path === '/leaderboard') {
      return <LeaderboardPage status={status} leaderboard={leaderboard} myTeamId={myTeamId} />
    }

    if (path === '/quiz') {
      return (
        <QuizPage
          status={status}
          question={question}
          answer={answer}
          result={result}
          isAnswerDisabled={isAnswerDisabled}
          isResultOnly={isResultOnly}
          onAnswerChange={setAnswer}
          onSubmitAnswer={submitAnswer}
        />
      )
    }

    if (path === '/lobby') {
      return (
        <LobbyPage
          status={status}
          myTeamId={myTeamId}
          myTeamName={myTeamName}
          myTeamIcon={myTeamIcon}
          teams={teams}
          onLeave={leaveLobby}
        />
      )
    }

    return <JoinPage status={status} onJoin={joinLobby} />
  }

  return renderPage()
}

export default App
