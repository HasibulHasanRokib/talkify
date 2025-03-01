import { ChatHerder } from "@/components/chat/chat-herder";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessage } from "@/components/chat/chat-message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CurrentProfile } from "@/lib/auth/current-profile";
import { db } from "@/lib/prisma";
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

      {/* Main chat area */}
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
    </div>
  );
}
