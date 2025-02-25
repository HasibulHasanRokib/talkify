import { CurrentProfile } from "@/lib/auth/current-profile";
import { db } from "@/lib/prisma";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";
import { ServerSidebarHeader } from "./server-sidebar-header";
import { ServerSearchBar } from "./server-search-bar";
import { ScrollArea } from "../ui/scroll-area";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { ServerSection } from "./server-section";
import { ServerChannel } from "./server-channel";
import { ServerMember } from "./server-member";

const IconMap = {
  [ChannelType.TEXT]: <Hash className="h-5 w-5" />,
  [ChannelType.VOICE]: <Mic className="h-5 w-5" />,
  [ChannelType.VIDEO]: <Video className="h-5 w-5" />,
};
const RoleMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.KICK]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="h-5 w-5" />,
  [MemberRole.ADMIN]: <ShieldAlert className="h-5 w-5" />,
};

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

  return (
    <div className="hidden w-64 border-r bg-secondary p-2 md:block">
      <ServerSidebarHeader server={server} role={role} />
      <ScrollArea className="flex-1">
        <div className="mt-1">
          <ServerSearchBar
            data={[
              {
                label: "Text channels",
                type: "channel",
                data: textChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.channelName,
                  icon: IconMap[channel.channelType],
                })),
              },
              {
                label: "Voice channels",
                type: "channel",
                data: voiceChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.channelName,
                  icon: IconMap[channel.channelType],
                })),
              },
              {
                label: "Video channels",
                type: "channel",
                data: videoChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.channelName,
                  icon: IconMap[channel.channelType],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  id: member.profileId,
                  name: member.profile?.name,
                  icon: RoleMap[member.role],
                })),
              },
            ]}
          />
        </div>
      </ScrollArea>
      <ScrollArea>
        {!!textChannels.length && (
          <div>
            <ServerSection
              label="Text channels"
              sectionType="channel"
              role={role}
              channelType={ChannelType.TEXT}
              server={server}
            />
            {textChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                channel={channel}
                server={server}
                role={role}
              />
            ))}
          </div>
        )}
        {!!voiceChannels.length && (
          <div>
            <ServerSection
              label="Voice channels"
              sectionType="channel"
              role={role}
              channelType={ChannelType.VOICE}
              server={server}
            />
            {voiceChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                channel={channel}
                server={server}
                role={role}
              />
            ))}
          </div>
        )}
        {!!videoChannels.length && (
          <div>
            <ServerSection
              label="Video channels"
              sectionType="channel"
              role={role}
              channelType={ChannelType.VIDEO}
              server={server}
            />
            {videoChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                channel={channel}
                server={server}
                role={role}
              />
            ))}
          </div>
        )}
        {!!members.length && (
          <div>
            <ServerSection
              label="Members "
              sectionType="member"
              role={role}
              server={server}
            />
            {members.map((member) => (
              <ServerMember key={member.profileId} member={member} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
