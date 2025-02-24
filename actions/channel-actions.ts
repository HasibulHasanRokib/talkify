"use server";

import { CurrentProfile } from "@/lib/auth/current-profile";
import { db } from "@/lib/prisma";
import { createChannelSchema } from "@/lib/zod-schema";

import { ChannelType, MemberRole } from "@prisma/client";

//Create channel:
interface CreateChannelProps {
  channelName: string;
  type: ChannelType;
  serverId: string;
}

export async function createChannelAction({
  channelName,
  serverId,
  type,
}: CreateChannelProps) {
  try {
    const profile = await CurrentProfile();

    if (!profile) return { error: "Unauthorized" };

    const server = await db.server.findFirst({
      where: {
        id: serverId,
        profileId: profile.id,
      },
    });
    if (!server) return { error: "Server not found" };
    await db.server.update({
      where: {
        id: server.id,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            channelName,
            channelType: type,
            profileId: profile.id,
          },
        },
      },
    });

    return { success: "Create Successful" };
  } catch (error) {
    console.log("Create channel error:", error);
    return { error: "Something went wrong." };
  }
}

// Edit channel:
interface EditChannelActionProps {
  channelName: string;
  type: ChannelType;
  serverId: string;
  channelId: string;
}

export async function editChannelAction(values: EditChannelActionProps) {
  try {
    return { success: "Channel information update successful" };
  } catch (error) {
    console.log(error);
    return { error: "Channel edit failed! Try again later" };
  }
}

//Delete channel:
interface DeleteChannelActionProps {
  serverId: string;
  channelId: string;
}

export async function deleteChannelAction(values: DeleteChannelActionProps) {
  return true;
}
