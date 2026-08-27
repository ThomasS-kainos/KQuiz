import { useEffect, useState } from 'react';
import type { ServerStatus } from './preload.ts';
import HostControlPage from './HostControlPage';
import QuizEditorPage from './QuizEditorPage';
import { useShortcut } from './hooks/useShortcut';
import { deleteQuiz, listQuizzes } from './storage/quizzes';
import type { StoredQuiz } from './types/quiz';

type EditorState = { open: false } | { open: true; quizId: string | null };

function App() {
  const [status, setStatus] = useState<ServerStatus>({ running: false, port: 0 });
  const [activeTab, setActiveTab] = useState<'create' | 'host'>('create');
  const [quizzes, setQuizzes] = useState<StoredQuiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editor, setEditor] = useState<EditorState>({ open: false });

  useEffect(() => {
    window.serverAPI.status().then(setStatus);
    const stored = listQuizzes();
    setQuizzes(stored);
    setSelectedQuizId(stored[0]?.id ?? null);
  }, []);

  const refreshQuizzes = () => {
    const stored = listQuizzes();
    setQuizzes(stored);
    setSelectedQuizId((current) =>
      stored.some((quiz) => quiz.id === current) ? current : stored[0]?.id ?? null,
    );
  };

  const handleDeleteQuiz = (quiz: StoredQuiz) => {
    if (!window.confirm(`Delete "${quiz.quizName}"? This cannot be undone.`)) return;
    deleteQuiz(quiz.id);
    refreshQuizzes();
  };

  const selectedQuiz = quizzes.find((quiz) => quiz.id === selectedQuizId) ?? null;

  const handleStart = async () => {
    if (!selectedQuiz) {
      setActiveTab('host');
      setError('Select a quiz to host first');
      return;
    }
    try {
      setError(null);
      const { quizName, questions } = selectedQuiz;
      setStatus(await window.serverAPI.start({ quizName, questions }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start the server');
    }
  };

  const handleStop = async () => {
    setStatus(await window.serverAPI.stop());
  };

  useShortcut('i', handleStart);

  if (editor.open) {
    return (
      <QuizEditorPage
        quizId={editor.quizId}
        onClose={() => setEditor({ open: false })}
        onSaved={() => {
          refreshQuizzes();
          setEditor({ open: false });
        }}
      />
    );
  }

  if (status.running) {
    return <HostControlPage port={status.port} onStop={handleStop} />;
  }

  return (
    <div className="app-titlebar-page">
      <header className="app-titlebar">
        <h1>Bench</h1>
      </header>
      <div className="app-content">
        <div className="panel">
          <div className="tab-bar" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'create'}
              className={`tab ${activeTab === 'create' ? 'tab--active' : ''}`}
              onClick={() => setActiveTab('create')}
            >
              Create a Quiz
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'host'}
              className={`tab ${activeTab === 'host' ? 'tab--active' : ''}`}
              onClick={() => setActiveTab('host')}
            >
              Host a Quiz
            </button>
          </div>

          {activeTab === 'create' ? (
            <div className="tab-panel" role="tabpanel">
              <h2>Create a Quiz</h2>
              <p>Build a new quiz or edit an existing one.</p>
              <div className="quiz-picker">
                <h3>Your quizzes</h3>
                {quizzes.length === 0 ? (
                  <p className="empty-state">No quizzes saved yet</p>
                ) : (
                  <ul className="quiz-list">
                    {quizzes.map((quiz) => (
                      <li key={quiz.id} className="quiz-row">
                        <button
                          type="button"
                          className="quiz-option"
                          onClick={() => setEditor({ open: true, quizId: quiz.id })}
                        >
                          <span>{quiz.quizName}</span>
                          <span className="quiz-option__meta">
                            {quiz.questions.length} questions
                          </span>
                        </button>
                        <button
                          type="button"
                          className="button--icon button--danger"
                          aria-label={`Delete ${quiz.quizName}`}
                          onClick={() => handleDeleteQuiz(quiz)}
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="control-grid">
                <button
                  type="button"
                  onClick={() => setEditor({ open: true, quizId: null })}
                >
                  New Quiz
                </button>
              </div>
            </div>
          ) : (
            <div className="tab-panel" role="tabpanel">
              <h2>Host a Quiz</h2>
              <p>Choose a quiz, then start the embedded game server.</p>
              <span className="status-badge status-badge--offline">
                <span className="status-badge__dot" />
                Server stopped
              </span>
              {error && <p className="error-text">{error}</p>}
              <div className="quiz-picker">
                <h3>Select a quiz</h3>
                {quizzes.length === 0 ? (
                  <p className="empty-state">No quizzes saved yet</p>
                ) : (
                  <ul className="quiz-list">
                    {quizzes.map((quiz) => (
                      <li key={quiz.id}>
                        <button
                          type="button"
                          className={`quiz-option ${
                            quiz.id === selectedQuizId ? 'quiz-option--selected' : ''
                          }`}
                          aria-pressed={quiz.id === selectedQuizId}
                          onClick={() => setSelectedQuizId(quiz.id)}
                        >
                          <span>{quiz.quizName}</span>
                          <span className="quiz-option__meta">
                            {quiz.questions.length} questions
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="control-grid">
                <button onClick={handleStart} disabled={status.running || !selectedQuiz}>
                  Start Server
                </button>
              </div>
              <p className="shortcut-hint">⌘I / Ctrl+I to start the server</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

