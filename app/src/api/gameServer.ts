export interface HealthStatus {
  status: string;
}

export interface Team {
  id: string;
  name: string;
  teamIcon: string;
  joinTime: number;
}

function baseUrl(port: number): string {
  return `http://127.0.0.1:${port}`;
}

export async function getHealth(port: number): Promise<HealthStatus> {
  const res = await fetch(`${baseUrl(port)}/api/health`);
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  return res.json();
}

export async function getTeams(port: number): Promise<Team[]> {
  const res = await fetch(`${baseUrl(port)}/api/lobby/teams`);
  if (!res.ok) throw new Error(`Failed to fetch teams: ${res.status}`);
  return res.json();
}

export async function startQuiz(port: number): Promise<void> {
  const res = await fetch(`${baseUrl(port)}/api/game/start-quiz`, { method: 'POST' });
  if (!res.ok) throw new Error(`Failed to start quiz: ${res.status}`);
}

export async function nextQuestion(port: number): Promise<void> {
  const res = await fetch(`${baseUrl(port)}/api/game/next-question`, { method: 'POST' });
  if (!res.ok) throw new Error(`Failed to advance question: ${res.status}`);
}

export async function showAnswer(port: number): Promise<void> {
  const res = await fetch(`${baseUrl(port)}/api/game/show-answer`, { method: 'POST' });
  if (!res.ok) throw new Error(`Failed to show answer: ${res.status}`);
}

export async function showLeaderboard(port: number): Promise<void> {
  const res = await fetch(`${baseUrl(port)}/api/game/show-leaderboard`);
  if (!res.ok) throw new Error(`Failed to show leaderboard: ${res.status}`);
}