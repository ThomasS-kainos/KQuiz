import { useEffect, useState } from 'react';
import {
  getHealth,
  getTeams,
  startQuiz,
  nextQuestion,
  showAnswer,
  showLeaderboard,
  type Team,
} from './api/gameServer';
import { useShortcut } from './hooks/useShortcut';

interface HostControlPageProps {
  port: number;
  onStop: () => void;
}

function HostControlPage({ port, onStop }: HostControlPageProps) {
  const [health, setHealth] = useState('checking...');
  const [teams, setTeams] = useState<Team[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const pollHealth = async () => {
      try {
        const result = await getHealth(port);
        if (!cancelled) setHealth(result.status);
      } catch {
        if (!cancelled) setHealth('unreachable');
      }
    };

    const pollTeams = async () => {
      try {
        const result = await getTeams(port);
        if (!cancelled) setTeams(result);
      } catch {
        // Leave the previous team list in place if the poll fails.
      }
    };

    pollHealth();
    pollTeams();
    const interval = setInterval(() => {
      pollHealth();
      pollTeams();
    }, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [port]);

  const withErrorHandling = (action: () => Promise<void>) => async () => {
    try {
      setError(null);
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  const isOnline = health === 'healthy';

  useShortcut('s', withErrorHandling(() => startQuiz(port)));
  useShortcut('n', withErrorHandling(() => nextQuestion(port)));
  useShortcut('t', withErrorHandling(() => showAnswer(port)));
  useShortcut('l', withErrorHandling(() => showLeaderboard(port)));
  useShortcut('q', onStop);

  return (
    <div className="app-titlebar-page">
      <header className="app-titlebar">
        <h1>Host Controls</h1>
      </header>
      <div className="app-content">
        <div className="panel">
          <span className={`status-badge ${isOnline ? 'status-badge--online' : 'status-badge--offline'}`}>
            <span className="status-badge__dot" />
            Server {health} on port {port}
          </span>
          {error && <p className="error-text">{error}</p>}
          <div className="control-grid">
            <button onClick={withErrorHandling(() => startQuiz(port))}>
              Start Quiz <span className="shortcut-key">⌘S</span>
            </button>
            <button onClick={withErrorHandling(() => nextQuestion(port))}>
              Next Question <span className="shortcut-key">⌘N</span>
            </button>
            <button onClick={withErrorHandling(() => showAnswer(port))}>
              Show Answer <span className="shortcut-key">⌘T</span>
            </button>
            <button onClick={withErrorHandling(() => showLeaderboard(port))}>
              Show Leaderboard <span className="shortcut-key">⌘L</span>
            </button>
            <button className="button--danger" onClick={onStop}>
              Stop Server <span className="shortcut-key">⌘Q</span>
            </button>
          </div>
          <div className="teams-section">
            <h2>Lobby ({teams.length})</h2>
            {teams.length === 0 ? (
              <p className="empty-state">No teams have joined yet</p>
            ) : (
              <ul className="teams-list">
                {teams.map((team) => (
                  <li key={team.id}>
                    <span className="team-icon">{team.teamIcon}</span>
                    <span>{team.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HostControlPage;
