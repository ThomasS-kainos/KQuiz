import { useEffect, useState } from 'react';
import type { ServerStatus } from './preload.ts';

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

  return (
    <>
      <h1>💖 Hello World!</h1>
      <p>Welcome to your Electron application.</p>
      <div id="server-controls">
        <button onClick={handleStart} disabled={status.running}>
          Start Server
        </button>
        <button onClick={handleStop} disabled={!status.running}>
          Stop Server
        </button>
        <p>
          Status: {status.running ? `running on port ${status.port}` : 'stopped'}
        </p>
      </div>
    </>
  );
}

export default App;
