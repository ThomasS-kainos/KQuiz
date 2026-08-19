import express, { type Request, type Response } from 'express';

import { lobbyStore } from '../SingletonStore/lobby.ts';
import { Team } from '../SingletonStore/team.ts';

export const router = express.Router({ caseSensitive: true, strict: true });

router.get("/health", (req: Request, res: Response) => {
  res.json({ status: 'healthy'});
});

router.get("/teams", (req: Request, res: Response) => {
  const teams = Array.from(lobbyStore.teamList.values()).map(team => ({
    id: team.id,
    name: team.name,
    joinTime: team.joinTime
  }));
  res.json(teams);
});

router.post('/join', (req: Request, res: Response) => {
  const { teamName } = req.body;
  if (!teamName || typeof teamName !== 'string') {
    return res.status(400).json({ error: 'Invalid team name' });
  }

  const newTeam = new Team(teamName);
  lobbyStore.AddTeam(newTeam);

  res.status(201).json({ uuid: `${newTeam.id}`, message: `Team ${teamName} joined successfully` });
});

router.delete("/leave", (req: Request, res: Response) => {
  const { teamId } = req.body;
  if (!teamId || typeof teamId !== 'string') {
    return res.status(400).json({ error: 'Invalid team ID' });
  }

  if (lobbyStore.teamList.has(teamId)) {
    lobbyStore.teamList.delete(teamId);
    return res.status(200).json({ message: `Team with ID ${teamId} left successfully` });
  } else {
    return res.status(404).json({ error: 'Team not found' });
  }
});