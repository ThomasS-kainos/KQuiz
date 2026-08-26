import { useEffect, useState } from 'react';
import type { ServerStatus } from './preload.ts';
import HostControlPage from './HostControlPage';
import { useShortcut } from './hooks/useShortcut';

function App() {
  const [status, setStatus] = useState<ServerStatus>({ running: false, port: 0 });

  useEffect(() => {
    window.serverAPI.status().then(setStatus);
  }, []);

  const handleStart = async () => {
    setStatus(await window.serverAPI.start());
  };

  const handleStop = async () => {
    setStatus(await window.serverAPI.stop());
  };

  useShortcut('i', handleStart);

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
          <h2>Quiz Host</h2>
          <p>Start the embedded game server to host a quiz.</p>
          <span className="status-badge status-badge--offline">
            <span className="status-badge__dot" />
            Server stopped
          </span>
          <div className="control-grid">
            <button onClick={handleStart} disabled={status.running}>
              Start Server
            </button>
          </div>
          <p className="shortcut-hint">⌘I / Ctrl+I to start the server</p>
        </div>
      </div>
    </div>
  );
}

export default App;

