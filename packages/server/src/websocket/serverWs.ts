import type { Server } from "node:http";
import { WebSocketServer, type WebSocket } from "ws";

import { clients } from "./clients.ts";
import { Message } from "./message.ts";

export function initWebSocket(server: Server): WebSocketServer {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (socket: WebSocket) => {
    clients.add(socket);
    socket.send(JSON.stringify({ type: Message.TeamsUpdate }));

    socket.on("close", () => {
      clients.delete(socket);
    });
  });

  return wss;
}
