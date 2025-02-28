"use client";
import { useSocket } from "@/context/socket-context";
import { Badge } from "@/components/ui/badge";
import { Member } from "@prisma/client";
export function ActiveToggle({ member }: { member: Member | undefined }) {
  const { onLineUsers } = useSocket();
  const isActive =
    member?.profileId &&
    onLineUsers?.some((user) => user.profile.id === member.profileId);
  return (
    <div>
      <Badge variant={isActive ? "success" : "destructive"}>
        {isActive ? "Online" : "offline"}
      </Badge>
    </div>
  );
}
