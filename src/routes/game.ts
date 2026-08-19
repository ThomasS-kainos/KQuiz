import express, { type Request, type Response } from 'express';

import { quizStore } from '../SingletonStore/quiz.ts';
import { broadcast } from '../websocket/clients.ts';
import { Message } from '../websocket/message.ts';

export const router = express.Router({ caseSensitive: true, strict: true });

// Once Auth in place, this endpoint should be protected to only allow the host to start the quiz.
router.post("/start-quiz", (req: Request, res: Response) => {
  quizStore.NextQuestion();
  broadcast({ type: Message.StartGame });
  res.status(200).json({ message: 'Quiz started' });
});

// Once Auth in place, this endpoint should be protected to only allow the host to start the quiz.
router.post("/next-question", (req: Request, res: Response) => {
  quizStore.NextQuestion();
  broadcast({ type: Message.NextQuestion });
  res.status(200).json({ message: 'Moved to next question' });
});

// Once Auth in place, this endpoint should be protected to only allow the host to start the quiz.
router.post("/show-answer", (req: Request, res: Response) => {
  const { answer } = quizStore.currentQuestion;
  broadcast({ type: Message.ShowAnswer, answer });
  res.status(200).json({ answer });
});

router.get("/current-question", (req: Request, res: Response) => {
  const { question } = quizStore.currentQuestion;
  res.status(200).json({ question });
});

router.post("/submit-answer", (req: Request, res: Response) => {
  const { answer } = req.body;
  if (!answer || typeof answer !== 'string') {
    return res.status(400).json({ error: 'Invalid answer' });
  }

  const isCorrect = answer.trim().toLowerCase() === quizStore.currentQuestion.answer.trim().toLowerCase();

  if (isCorrect) {
    // Update teams correct answer count in the lobby store (not implemented)
  }

  res.status(200).json({ message: "Answer Submitted" });
});

