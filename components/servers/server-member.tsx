"use client";
import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { UserAvatar } from "../user-avatar";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useSocket } from "@/context/socket-context";
import { cn } from "@/lib/utils";

interface ServerMemberProps {
  member: Member & { profile: Profile | null };
  server: Server;
}
const RoleMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.KICK]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 text-sky-500" />,
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 text-destructive" />,
};

export function ServerMember({ member, server }: ServerMemberProps) {
  const { onLineUsers } = useSocket();
  const isActive =
    member.profile &&
    onLineUsers?.some((user) => user.profile.id === member.profile?.id);

  return (
    <Link href={`/servers/${server.id}/conversations/${member.id}`}>
      <div className="flex items-center gap-x-2 px-2">
        <div className="relative">
          <UserAvatar url={member.profile?.imageUrl} className="h-7 w-7" />
          <div
            className={cn(
              "absolute bottom-0 right-0 rounded-full p-1",
              isActive ? "bg-green-500" : "bg-slate-300",
            )}
          ></div>
        </div>
        <p className="flex items-center gap-x-1 text-sm text-muted-foreground">
          {member.profile?.name} {RoleMap[member.role]}
        </p>
      </div>
    </Link>
  );
}
