import type { Server } from "node:http";
import { WebSocketServer, type WebSocket } from "ws";

import { clients } from "./clients.ts";
import { Message } from "./message.ts";
import { lobbyStore } from "../SingletonStore/lobby.ts";

export function initWebSocket(server: Server): WebSocketServer {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (socket: WebSocket) => {
    clients.add(socket);
    // Bring the newly connected client up to date immediately.
    socket.send(JSON.stringify({ type: Message.TeamsUpdate, teams: lobbyStore.getTeams() }));

    socket.on("close", () => {
      clients.delete(socket);
    });
  });

  return wss;
}
