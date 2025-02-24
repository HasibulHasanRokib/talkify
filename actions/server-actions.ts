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

export async function deleteServerAction(serverId: string) {
  if (!serverId) return { error: "Server id not found!" };
  const profile = await CurrentProfile();
  if (!profile) return { error: "Unauthorized" };

  try {
    const server = await db.server.findFirst({
      where: {
        id: serverId,
        profileId: profile.id,
      },
    });

    if (!server) {
      return { error: "Server not found!" };
    }

    await db.server.delete({
      where: {
        id: server.id,
        members: {
          some: {
            profileId: profile.id,
            role: MemberRole.ADMIN,
          },
        },
      },
    });
    return { success: "Server deleted successfully." };
  } catch (error) {
    console.log("Delete server error:", error);
    return { error: "Something went wrong!" };
  }
}

interface TEditServerAction {
  serverId: string;
  values: TCreateServerSchema;
}

export async function editServerAction({
  serverId,
  values,
}: TEditServerAction) {
  try {
    const validation = createServerSchema.safeParse(values);
    if (!validation.success) return { error: "Invalid inputs!" };

    const { imageUrl, serverName } = validation.data;

    const profile = await CurrentProfile();

    if (!profile) return { error: "Unauthorized" };

    const server = await db.server.findFirst({
      where: {
        id: serverId,
        profileId: profile.id,
      },
    });

    if (!server) return { error: "Server not found!" };

    await db.server.update({
      where: {
        id: server.id,
        members: {
          some: {
            profileId: profile.id,
            role: MemberRole.ADMIN,
          },
        },
      },
      data: {
        imageUrl,
        serverName,
      },
    });

    return { success: "Server updated successfully." };
  } catch (error) {
    console.log("Edit server error:", error);
    return { error: "Something went wrong!" };
  }
}
interface TManageMemberAction {
  memberId: string;
  newRole: MemberRole;
  serverId: string;
}
export async function manageMemberAction({
  memberId,
  newRole,
  serverId,
}: TManageMemberAction) {
  const profile = await CurrentProfile();
  if (!profile) return { error: "Unauthorized" };
  if (!serverId) return { error: "Server id not found" };
  if (!memberId) return { error: "Member id not found" };

  try {
    const server = await db.server.findFirst({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: MemberRole.ADMIN,
          },
        },
      },
    });

    if (!server) return { error: "Server not found!" };

    if (newRole === MemberRole.KICK) {
      const updateMember = await db.server.update({
        where: {
          id: server.id,
          profileId: profile.id,
        },
        data: {
          members: {
            delete: {
              id: memberId,
              profileId: {
                not: profile.id,
              },
            },
          },
        },
        include: {
          members: {
            select: {
              id: true,
              profile: true,
              role: true,
            },
          },
        },
      });
      return { success: "This member kick from server.", updateMember };
    }

    const member = await db.member.findFirst({
      where: {
        id: memberId,
        serverId,
      },
    });

    if (!member) return { error: "Member not found!" };

    const updateMember = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
            },
            data: {
              role: newRole,
            },
          },
        },
      },
      include: {
        members: {
          select: {
            id: true,
            profile: true,
            role: true,
          },
        },
      },
    });

    return { success: "User role update successful.", updateMember };
  } catch (error) {
    console.log("Manage member error:", error);
    return { error: "Something went wrong!" };
  }
}
