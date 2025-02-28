// "use client";

import { Hash } from "lucide-react";
import { MobileToggle } from "../mobile-toggle";
import { UserAvatar } from "../user-avatar";
import { Member } from "@prisma/client";

import { ActiveToggle } from "./active-toggle";

interface ChatHerderProps {
  serverId: string;
  name?: string;
  type: "channel" | "conversation";
  imageUrl?: string;
  member?: Member;
}

export function ChatHerder({
  serverId,
  name,
  type,
  imageUrl,
  member,
}: ChatHerderProps) {
  return (
    <div className="flex w-full items-center gap-x-3 border-b px-3 py-4">
      <MobileToggle serverId={serverId} />
      <span className="flex items-center gap-x-1">
        {type === "channel" && (
          <div className="flex items-center gap-x-2">
            <Hash className="h-6 w-6" />
            <p className="text-xl">{name}</p>
          </div>
        )}
        {type === "conversation" && (
          <div className="flex w-full items-center gap-x-3">
            <div className="flex items-center gap-x-1">
              <UserAvatar url={imageUrl} className="mr-3" />
              <p className="text-xl">{name}</p>
            </div>
            <ActiveToggle member={member} />
          </div>
        )}
      </span>
    </div>
  );
}
