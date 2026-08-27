import { app, BrowserWindow, ipcMain } from 'electron';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import started from 'electron-squirrel-startup';
import type { RunningServer } from '@kquiz/server';

const dirname = path.dirname(fileURLToPath(import.meta.url));

// The embedded server resolves its own `public/` assets relative to this root
// (import.meta.dirname doesn't survive being bundled into this CJS main process).
process.env.BENCH_SERVER_ROOT ??= path.resolve(dirname, '../../../packages/server');

// Deferred so BENCH_SERVER_ROOT is set before the server module's top-level code runs.
const serverModule = import('@kquiz/server');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

let runningServer: RunningServer | null = null;

ipcMain.handle('server:start', async () => {
  const { startServer, DEFAULT_PORT } = await serverModule;
  if (!runningServer) {
    runningServer = await startServer(DEFAULT_PORT);
  }
  return { running: true, port: DEFAULT_PORT };
});

ipcMain.handle('server:stop', async () => {
  const { stopServer, DEFAULT_PORT } = await serverModule;
  if (runningServer) {
    await stopServer(runningServer);
    runningServer = null;
  }
  return { running: false, port: DEFAULT_PORT };
});

ipcMain.handle('server:status', async () => {
  const { DEFAULT_PORT } = await serverModule;
  return { running: runningServer !== null, port: DEFAULT_PORT };
});

// Preload runs sandboxed, so `os` lookups have to happen here in the main process.
const getLocalIpAddress = (): string => {
  for (const addresses of Object.values(os.networkInterfaces())) {
    for (const address of addresses ?? []) {
      if (address.family === 'IPv4' && !address.internal) {
        return address.address;
      }
    }
  }
  return '127.0.0.1';
};

ipcMain.handle('network:local-ip', () => getLocalIpAddress());

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Ensure the embedded server is shut down cleanly before the app quits.
app.on('before-quit', async (event) => {
  if (runningServer) {
    event.preventDefault();
    const { stopServer } = await serverModule;
    await stopServer(runningServer);
    runningServer = null;
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
