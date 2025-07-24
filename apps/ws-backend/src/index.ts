import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/common";
import { prismaClient } from "@repo/db";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket;
  userId: string;
  rooms: string[];
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch (error) {
    return null;
  }
}

wss.on("connection", (socket, request) => {
  const url = request.url;
  if (!url) return;
  console.log("connected");

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token");
  if (!token) return;

  const userId = checkUser(token);
  if (userId === null) {
    socket.close();
    return;
  }
  //@ts-ignore
  users.push({ ws: socket, userId, rooms: [] });

  socket.on("message", async (data) => {
    const parsedData = JSON.parse(data as unknown as string);

    if (parsedData.type === "join_room") {
      const roomId = parsedData.roomId;
      const user = users.find((u) => u.ws === socket);
      user?.rooms.push(roomId);
    }

    if (parsedData.type === "leave_room") {
      const roomId = parsedData.roomId;
      const user = users.find((u) => u.ws === socket);
      if (!user) return;
      user.rooms = user?.rooms.filter((r) => r !== roomId);
    }

    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      await prismaClient.chat.create({
        data: {
          roomId,
          message,
          userId,
        },
      });

      users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(
            JSON.stringify({
              type: "chat",
              message: message,
              roomId,
            })
          );
        }
      });
    }
  });
});
