import path from 'node:path';
import type { Server } from 'node:http';
import express, { type Express, type Request, type Response } from 'express';
import type { WebSocketServer } from 'ws';

import { router as gameRouter } from './routes/game.ts';
import { router as lobbyRouter } from './routes/lobby.ts';
import { initWebSocket } from './websocket/serverWs.ts';
import { getServerRoot } from './paths.ts';

export const DEFAULT_PORT = 3000;

export interface RunningServer {
  server: Server;
  wss: WebSocketServer;
}

function createApp(): Express {
  const app: Express = express();

  //Create public directory path
  const publicDir = path.resolve(getServerRoot(), 'public');
  const webpageDir = path.join(publicDir, 'webpage');
  app.use('/public', express.static(publicDir));

  //Define Response Type for Express
  app.use(express.json());

  // Allow the Electron/Vite dev renderer (different origin) to call the API.
  app.use((req: Request, res: Response, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, teamID');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });

  app.use('/api/lobby', lobbyRouter);
  app.use('/api/game', gameRouter);

  // Health Check Route
  app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy'});
  });

  app.use('/api', (req: Request, res: Response) => {
    res.status(200).json({ 
      environment: process.env.NODE_ENV || 'production',
      message: 'Welcome to the Kainos Quiz API',
      endpoints: {
        '/api/lobby': 'Lobby related endpoints',
        '/api/game': 'Game related endpoints',
        '/api/health': 'Health check endpoint'
      }
    });
  });

  app.use(express.static(webpageDir));

  app.get(/.*/, (req: Request, res: Response) => {
    res.sendFile(path.join(webpageDir, 'index.html'));
  });

  return app;
}

// Starts the HTTP + WebSocket server; resolves once listening.
export function startServer(port: number = DEFAULT_PORT): Promise<RunningServer> {
  return new Promise((resolve) => {
    const app = createApp();
    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port} in ${process.env.NODE_ENV || 'production'} mode`);
      resolve({ server, wss: initWebSocket(server) });
    });
  });
}

// Closes all websocket clients and the HTTP server; resolves once fully shut down.
export function stopServer({ server, wss }: RunningServer): Promise<void> {
  return new Promise((resolve, reject) => {
    wss.clients.forEach((client) => client.close());
    wss.close(() => {
      server.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
}