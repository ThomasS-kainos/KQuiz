import path from 'node:path';
import express, { type Express, type Request, type Response } from 'express';

import { router as gameRouter } from './routes/game.ts';
import { router as lobbyRouter } from './routes/lobby.ts';
import { initWebSocket } from './websocket/serverWs.ts';

const PORT = 3000;
const app: Express = express();

//Create public directory path
const publicDir = path.resolve(import.meta.dirname, '..', 'public');
const webpageDir = path.join(publicDir, 'webpage');
app.use('/public', express.static(publicDir));

//Define Response Type for Express
app.use(express.json());

app.use('/api/lobby', lobbyRouter);
app.use('/api/game', gameRouter);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy'});
});

app.use('/api', (req: Request, res: Response) => {
  res.status(404).json({ error: 'API route not found' });
});

app.use(express.static(webpageDir));

app.get(/.*/, (req: Request, res: Response) => {
  res.sendFile(path.join(webpageDir, 'index.html'));
});

export const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

initWebSocket(server);