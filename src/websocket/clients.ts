import type { WebSocket } from "ws";

export const clients: Set<WebSocket> = new Set();

export function broadcast(data: unknown): void {
  const message = JSON.stringify(data);
  for (const client of clients) {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  }
}
