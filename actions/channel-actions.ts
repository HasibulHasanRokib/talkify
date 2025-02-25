"use server";

import { CurrentProfile } from "@/lib/auth/current-profile";
import { db } from "@/lib/prisma";
import { createChannelSchema, TCreateChannelSchema } from "@/lib/zod-schema";

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
  values: TCreateChannelSchema;
  serverId: string;
  channelId: string;
}

export async function editChannelAction({
  values,
  serverId,
  channelId,
}: EditChannelActionProps) {
  const validation = createChannelSchema.safeParse(values);
  if (!validation.success) {
    return { error: "Invalid data" };
  }
  const { channelName, type } = validation.data;
  const profile = await CurrentProfile();
  if (!profile) return { error: "Unauthorized" };
  if (!serverId) return { error: "Server not found" };
  if (!channelId) return { error: "Channel not found" };

  try {
    await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
        members: {
          some: {
            role: MemberRole.ADMIN,
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: channelId,
            },
            data: {
              channelName,
              channelType: type,
            },
          },
        },
      },
    });
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
  const { serverId, channelId } = values;

  const profile = await CurrentProfile();
  if (!profile) return { error: "Unauthorized" };
  if (!serverId) return { error: "Server not found" };
  if (!channelId) return { error: "Channel not found" };
  try {
    await db.server.update({
      where: {
        id: serverId,

        members: {
          some: {
            profileId: profile.id,
            role: MemberRole.ADMIN,
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: channelId,
          },
        },
      },
    });
    return { success: "Channel deleted successfully" };
  } catch (error) {
    console.log("Delete channel error:", error);
    return { error: "Something went wrong." };
  }
}
