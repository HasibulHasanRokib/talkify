import { ChatHerder } from "@/components/chat/chat-herder";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import React from "react";

export default async function MemberIdPage({
  params,
}: {
  params: Promise<{ serverId: string; memberId: string }>;
}) {
  const { serverId, memberId } = await params;
  const member = await db.member.findUnique({
    where: {
      serverId,
      id: memberId,
    },
    include: {
      profile: true,
    },
  });
  if (!member) return redirect("/");
  return (
    <div>
      <ChatHerder
        name={member.profile?.name}
        type="conversation"
        imageUrl={member?.profile?.imageUrl}
        serverId={serverId}
        member={member}
      />
    </div>
  );
}
