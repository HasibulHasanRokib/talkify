import { CurrentProfile } from "@/lib/auth/current-profile";
import { db } from "@/lib/prisma";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

export async function ServerMainSidebar({ serverId }: { serverId: string }) {
  const profile = await CurrentProfile();
  if (!profile) return redirect("/sign-in");

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!server) return redirect("/");

  const role = server?.members.find(
    (member) => member.profileId === profile.id,
  )?.role;

  const textChannels = server.channels.filter(
    (channel) => channel.channelType === ChannelType.TEXT,
  );
  const voiceChannels = server.channels.filter(
    (channel) => channel.channelType === ChannelType.VOICE,
  );
  const videoChannels = server.channels.filter(
    (channel) => channel.channelType === ChannelType.VIDEO,
  );

  const members = server.members.filter(
    (member) => member.profileId !== profile.id,
  );

  return <div>ServerMainSidebar</div>;
}
