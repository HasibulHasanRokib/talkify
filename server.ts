import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";
import { Profile } from "@prisma/client";
import { db } from "./lib/prisma";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });
  const io = new Server(httpServer);

  interface IOnlineUser {
    socketId: string;
    profile: Profile;
  }

  let onlineUsers: IOnlineUser[] = [];

  io.on("connection", (socket) => {
    //add user
    socket.on("add-new-user", async (userId: string) => {
      if (!userId) return;

      const profile = await db.profile.findFirst({ where: { userId } });
      if (!profile) return;

      if (!onlineUsers.some((user) => user.profile.id === profile.id)) {
        onlineUsers.push({ socketId: socket.id, profile });
      }
      io.emit("get-users", onlineUsers);
    });

    //join-room
    socket.on("join-room", async (channelId: string) => {
      socket.join(channelId);
    });

    // Handle sending messages
    socket.on(
      "send_message",
      async (data: {
        content: string;
        memberId: string;
        channelId: string;
      }) => {
        console.log(data);
        const { content, channelId, memberId } = data;
        if (!content || !channelId || !memberId) {
          return;
        }
        try {
          await db.message.create({
            data: {
              content,
              channelId,
              memberId,
            },
            include: {
              member: {
                include: {
                  profile: true,
                },
              },
            },
          });
          console.log(
            `Message saved from ${memberId} in channel ${channelId}: ${content}`,
          );
        } catch (error) {
          console.error("Error saving message:", error);
        }
      },
    );

    //filter active user
    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      io.emit("get-users", onlineUsers);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(
        `> Server listening at http://localhost:${port} as ${
          dev ? "development" : process.env.NODE_ENV
        }`,
      );
    });
});
