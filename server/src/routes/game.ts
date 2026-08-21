import express, { type Request, type Response } from 'express';

import { quizStore } from '../SingletonStore/quiz.ts';
import { broadcast } from '../websocket/clients.ts';
import { Message } from '../websocket/message.ts';
import { lobbyStore } from '../SingletonStore/lobby.ts';
import { isCorrectAnswer } from '../utils/answerChecker.ts';

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
  if (!quizStore.currentQuestion) {
    return res.status(404).json({ error: 'No current question' });
  }

  const { answer } = quizStore.currentQuestion;
  broadcast({ type: Message.ShowAnswer });
  res.status(200).json({ answer });
});

router.get("/current-answer", (req: Request, res: Response) => {
  if (!quizStore.currentQuestion) {
    return res.status(404).json({ error: 'No current question' });
  }

  const { answer } = quizStore.currentQuestion;
  res.status(200).json({ answer });
});

router.get("/show-leaderboard", (req: Request, res: Response) => {
    broadcast({ type: Message.ShowLeaderboard });
    
    res.status(200).json({ message: 'Leaderboard broadcasted' });
});

router.get("/leaderboard", (req: Request, res: Response) => {
    const leaderboard = Array.from(lobbyStore.teamList.values())
    .map(team => ({
      id: team.id,
      name: team.name,
      teamIcon: team.teamIcon,
      correctAnswers: team.correctAnswers,
      incorrectAnswers: team.incorrectAnswers
    }))
    .sort((a, b) => b.correctAnswers - a.correctAnswers);

  res.status(200).json({ leaderboard: leaderboard });
});

router.get("/current-question", (req: Request, res: Response) => {
  if (!quizStore.currentQuestion) {
    return res.status(404).json({ error: 'No current question' });
  }

  // Omit the answer so it isn't leaked to clients requesting the question.
  const { answer, ...question } = quizStore.currentQuestion;
  res.status(200).json({ question });
});

router.post("/submit-answer", (req: Request, res: Response) => {
  const { answer } = req.body;
  if (!answer || (typeof answer !== 'string' && !Array.isArray(answer))) {
    return res.status(400).json({ error: 'Invalid answer' });
  }

  const teamID = req.get("teamID");
  if (!teamID || typeof teamID !== 'string') {
    return res.status(400).json({ error: 'Invalid team ID' });
  }

  const team = lobbyStore.getTeamById(teamID);

  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }

  if (!quizStore.currentQuestion) {
    return res.status(404).json({ error: 'No current question' });
  }

  const isCorrect = isCorrectAnswer(quizStore.currentQuestion, answer);

  if (isCorrect) {
    team.correctAnswers++;
  } else {
    team.incorrectAnswers++;
  }

  res.status(200).json({ message: "Answer Submitted", correct: isCorrect });
});


