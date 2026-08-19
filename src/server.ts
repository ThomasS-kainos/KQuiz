import path from 'node:path';
import express, { type Express, type Request, type Response } from 'express';

import { router as lobbyRouter } from './routes/lobby.ts';

const PORT = 3000;
const app: Express = express();

//Create public directory path
const publicDir = path.resolve(import.meta.dirname, '..', 'public');
app.use('/public', express.static(publicDir));

//Define Response Type for Express
app.use(express.json());

app.use('/lobby', lobbyRouter);

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

export const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});