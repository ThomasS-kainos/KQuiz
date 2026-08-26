import { useEffect, useState } from 'react';
import {
  getHealth,
  startQuiz,
  nextQuestion,
  showAnswer,
  showLeaderboard,
} from './api/gameServer';

interface HostControlPageProps {
  port: number;
  onStop: () => void;
}

function HostControlPage({ port, onStop }: HostControlPageProps) {
  const [health, setHealth] = useState('checking...');
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

    pollHealth();
    const interval = setInterval(pollHealth, 5000);
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

  return (
    <>
      <h1>Host Controls</h1>
      <p>Server health: {health}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div id="host-controls">
        <button onClick={onStop}>Stop Server</button>
        <button onClick={withErrorHandling(() => startQuiz(port))}>Start Quiz</button>
        <button onClick={withErrorHandling(() => nextQuestion(port))}>Next Question</button>
        <button onClick={withErrorHandling(() => showAnswer(port))}>Show Answer</button>
        <button onClick={withErrorHandling(() => showLeaderboard(port))}>Show Leaderboard</button>
      </div>
    </>
  );
}

export default HostControlPage;
