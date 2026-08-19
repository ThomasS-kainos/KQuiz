import express, { type Request, type Response } from 'express';

import { quizStore } from '../SingletonStore/quiz.ts';
import { broadcast } from '../websocket/clients.ts';
import { Message } from '../websocket/message.ts';

export const router = express.Router({ caseSensitive: true, strict: true });

// Implement: Called via the API (Not exposed on the frontend) to start the quiz and to tell the clients to get /current-question and display the first question
router.post("/start-quiz", (req: Request, res: Response) => {
  quizStore.NextQuestion();
  broadcast({ type: Message.StartGame });
  res.status(200).json({ message: 'Quiz started' });
});

// Implement: Called via the API (Not exposed on the frontend) to tell the clients to get /current-question and display the next question
router.post("/next-question", (req: Request, res: Response) => {
  quizStore.NextQuestion();
  broadcast({ type: Message.NextQuestion });
  res.status(200).json({ message: 'Moved to next question' });
});

// Implement: Called via the Frontend to get current-question and display it on webpage
router.get("/current-question", (req: Request, res: Response) => {
  res.status(200).json(quizStore.currentQuestion);
});

// Implement: Called via the Frontend to submit an answer to the current question
router.post("/submit-answer", (req: Request, res: Response) => {
  const { answer } = req.body;
  if (!answer || typeof answer !== 'string') {
    return res.status(400).json({ error: 'Invalid answer' });
  }

  const isCorrect = answer.trim().toLowerCase() === quizStore.currentQuestion.answer.trim().toLowerCase();

  if (isCorrect) {
    // Update teams correct answer count in the lobby store (not implemented)
  }

  res.status(200).json({ correct: isCorrect });
});

