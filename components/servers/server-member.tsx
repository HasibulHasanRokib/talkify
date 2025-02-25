import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { UserAvatar } from "../user-avatar";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import Link from "next/link";

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
  return (
    <Link href={`/servers/${server.id}/conversations/${member.id}`}>
      <div className="my-3 flex items-center gap-x-2 px-3 py-1">
        <UserAvatar url={member.profile?.imageUrl} className="h-7 w-7" />
        <p className="flex items-center gap-x-1 text-sm text-muted-foreground">
          {member.profile?.name} {RoleMap[member.role]}
        </p>
      </div>
    </Link>
  );
}
