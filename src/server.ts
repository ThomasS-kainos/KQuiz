import path from 'node:path';
import express, { type Express, type Request, type Response } from 'express';
import { WebSocketServer } from "ws";

const PORT = 3000;

const app: Express = express();

//Create public directory path
const publicDir = path.resolve(import.meta.dirname, '..', 'public');
app.use('/public', express.static(publicDir));

//Define Response Type for Express
app.use(express.json());

// Health Check Route
app.get('/health', (req, res) => {
  res.json({ status: 'healthy'});
});

//Current Test Route
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(publicDir, 'webpage', 'quizWeb.html'));
});

export const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("New WebSocket connection established.")

  ws.on("message", (message) => {  
    console.log("Received message:", message.toString());
});

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("WebSocket server is running on ws://localhost:3000");
