import { Hash } from "lucide-react";
import { MobileToggle } from "../mobile-toggle";
import { UserAvatar } from "../user-avatar";

interface ChatHerderProps {
  serverId: string;
  name?: string;
  type: "channel" | "conversation";
  imageUrl?: string;
}

export function ChatHerder({
  serverId,
  name,
  type,
  imageUrl,
}: ChatHerderProps) {
  return (
    <div className="flex w-full items-center gap-x-3 border-b-2 px-3 py-4">
      <MobileToggle serverId={serverId} />
      <span className="flex items-center gap-x-1">
        {type === "channel" && <Hash className="h-6 w-6" />}
        {type === "conversation" && (
          <UserAvatar url={imageUrl} className="mr-3" />
        )}
        <p className="text-xl">{name}</p>
      </span>
    </div>
  );
}
