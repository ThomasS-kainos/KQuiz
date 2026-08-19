import path from 'node:path';
import express, { type Express, type Request, type Response } from 'express';

import { router as gameRouter } from './routes/game.ts';
import { router as lobbyRouter } from './routes/lobby.ts';
import { initWebSocket } from './websocket/serverWs.ts';

const PORT = 3000;
const app: Express = express();

//Create public directory path
const publicDir = path.resolve(import.meta.dirname, '..', 'public');
app.use('/public', express.static(publicDir));

//Define Response Type for Express
app.use(express.json());

app.use('/lobby', lobbyRouter);
app.use('/game', gameRouter);

// Health Check Route
app.get('/health', (req, res) => {
  res.json({ status: 'healthy'});
});

//Entry / lobby page
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(publicDir, 'webpage', 'index.html'));
});

//Quiz page
app.get('/quiz', (req: Request, res: Response) => {
  res.sendFile(path.join(publicDir, 'webpage', 'quizWeb.html'));
});

//Leaderboard page
app.get('/leaderboard', (req: Request, res: Response) => {
  res.sendFile(path.join(publicDir, 'webpage', 'leaderboard.html'));
});

export const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

initWebSocket(server);