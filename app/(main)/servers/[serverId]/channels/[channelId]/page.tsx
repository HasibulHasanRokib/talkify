import { ChatHerder } from "@/components/chat/chat-herder";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessage } from "@/components/chat/chat-message";
import { MediaRoom } from "@/components/media-room";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CurrentProfile } from "@/lib/auth/current-profile";
import { db } from "@/lib/prisma";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function ChannelIdPage({
  params,
}: {
  params: Promise<{ channelId: string; serverId: string }>;
}) {
  const profile = await CurrentProfile();
  if (!profile) return redirect("/sign-in");

  const { channelId, serverId } = await params;

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) return redirect("/");

  return (
    <div className="flex h-screen flex-col">
      <ChatHerder
        name={channel.channelName}
        type="channel"
        serverId={channel.serverId}
      />
      {channel.channelType === ChannelType.TEXT && (
        <>
          <div className="relative flex-1 overflow-hidden">
            <ScrollArea className="absolute h-full w-full">
              <div className="flex flex-col p-4">
                <ChatMessage channelId={channelId} profileId={profile.id} />
              </div>
            </ScrollArea>
          </div>

          <ChatInput
            channelId={channel.id}
            memberId={member.id}
            name={channel.channelName}
            serverId={serverId}
          />
        </>
      )}

      {channel.channelType === ChannelType.VIDEO && (
        <div className="relative flex-1 overflow-hidden">
          <div className="absolute h-full w-full">
            <MediaRoom chatId={channel.id} video={true} audio={true} />
          </div>
        </div>
      )}

      {channel.channelType === ChannelType.VOICE && (
        <div className="relative flex-1 overflow-hidden">
          <div className="absolute h-full w-full">
            <MediaRoom chatId={channel.id} video={false} audio={true} />
          </div>
        </div>
      )}
    </div>
  );
}
