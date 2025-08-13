import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware.js";
import {
  CreateUserSchema,
  SigninSchema,
  CreateRoomSchema,
  JWT_SECRET,
} from "@repo/common";
import { prismaClient } from "@repo/db";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/signup", async (req, res) => {
  const parsedData = CreateUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    console.log(parsedData.error);
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }
  try {
    const checkUser = await prismaClient.user.findFirst({
      where: {
        email: parsedData.data.username,
      },
    });

    if (checkUser) {
      return res.status(409).json("invalid credentials");
    }

    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data?.username,
        // TODO: Hash the pw
        password: parsedData.data.password,
        name: parsedData.data.name,
      },
    });

    const token = jwt.sign(
      {
        userId: user?.id,
      },
      JWT_SECRET
    );

    return res.status(200).json({
      token,
    });
  } catch (e) {
    res.status(411).json({
      message: "User already exists with this username",
    });
  }
});

app.post("/signin", async (req, res) => {
  const parsedData = SigninSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }

  // TODO: Compare the hashed pws here
  const user = await prismaClient.user.findFirst({
    where: {
      email: parsedData.data.username,
      password: parsedData.data.password,
    },
  });

  if (!user) {
    res.status(403).json({
      message: "Not authorized",
    });
    return;
  }

  const token = jwt.sign(
    {
      userId: user?.id,
    },
    JWT_SECRET
  );

  res.json({
    token,
  });
});

app.post("/room", middleware, async (req, res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }
  // @ts-ignore: TODO: Fix this
  const userId = req.userId;

  try {
    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data.name,
        adminId: userId,
      },
    });

    res.json({
      roomId: room.id,
      room: {
        id: room.id,
        slug: room.slug,
        createdAt: room.createdAt,
        adminId: room.adminId,
      },
    });
  } catch (e) {
    res.status(411).json({
      message: "Room already exists with this name",
    });
  }
});

app.get("/chats/:roomId", async (req, res) => {
  try {
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        id: "desc",
      },
      take: 100,
    });

    const reversedMessages = messages.reverse();

    res.json({
      messages: reversedMessages,
    });
  } catch (e) {
    console.log("http:backend :: chats endpoint ::", e);
    res.json({
      messages: [],
    });
  }
});

app.get("/room/:slug", async (req, res) => {
  const slug = req.params.slug;
  const room = await prismaClient.room.findFirst({
    where: {
      slug,
    },
  });

  res.json({
    id: room.id,
    slug: room.slug,
    createdAt: room.createdAt,
    adminId: room.adminId,
  });
});

app.get("/userRooms", middleware, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;

  const rooms = await prismaClient.room.findMany({
    where: {
      adminId: userId,
    },
  });

  res.json(rooms);
});

app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
