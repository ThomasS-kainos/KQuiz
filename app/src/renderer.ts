/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';

const startButton = document.getElementById('server-start') as HTMLButtonElement;
const stopButton = document.getElementById('server-stop') as HTMLButtonElement;
const statusText = document.getElementById('server-status') as HTMLParagraphElement;

function renderStatus(status: { running: boolean; port: number }) {
  statusText.textContent = status.running
    ? `Status: running on port ${status.port}`
    : 'Status: stopped';
  startButton.disabled = status.running;
  stopButton.disabled = !status.running;
}

startButton.addEventListener('click', async () => {
  renderStatus(await window.serverAPI.start());
});

stopButton.addEventListener('click', async () => {
  renderStatus(await window.serverAPI.stop());
});

window.serverAPI.status().then(renderStatus);


console.log(
  '👋 This message is being logged by "renderer.ts", included via Vite',
);
