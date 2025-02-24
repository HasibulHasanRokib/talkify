"use server";

import { CurrentProfile } from "@/lib/auth/current-profile";
import { db } from "@/lib/prisma";
import { createServerSchema, TCreateServerSchema } from "@/lib/zod-schema";
import { MemberRole } from "@prisma/client";

import { v4 as uuid } from "uuid";

//create server:
export async function createServerAction(values: TCreateServerSchema) {
  try {
    const validation = createServerSchema.safeParse(values);
    if (!validation.success) return { error: "Invalid inputs!" };

    const { imageUrl, serverName } = validation.data;

    const profile = await CurrentProfile();

    if (!profile) return { error: "Unauthorized" };
    const newServer = await db.server.create({
      data: {
        serverName,
        imageUrl,
        profileId: profile.id,
        inviteCode: uuid(),
        channels: {
          create: {
            channelName: "general",
            profileId: profile.id,
          },
        },
        members: {
          create: {
            profileId: profile.id,
            role: MemberRole.ADMIN,
          },
        },
      },
    });

    return { success: "Server create successful.", newServer };
  } catch (error) {
    console.log("Create server error:", error);
    return { error: "Something went wrong!" };
  }
}
export async function joinServerAction(link: string) {
  try {
    const profile = await CurrentProfile();
    if (!profile) return { error: "Unauthorized" };

    const inviteCode = link.split("/").pop();

    const server = await db.server.findFirst({
      where: {
        inviteCode,
      },
    });

    if (!server) return { error: "Invalid link!" };

    await db.member.create({
      data: {
        profileId: profile.id,
        serverId: server.id,
      },
    });

    return { success: "Server joined successfully.", server };
  } catch (error) {
    console.log("Join server error:", error);
    return { error: "Something went wrong!" };
  }
}
