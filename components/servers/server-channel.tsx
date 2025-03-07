"use client";

import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { TooltipAction } from "../tooltip-action";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ServerChannelProps {
  channel: Channel;
  server?: Server;
  role?: MemberRole;
}

const IconMap = {
  [ChannelType.TEXT]: <Hash className="h-4 w-4" />,
  [ChannelType.VOICE]: <Mic className="h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="h-4 w-4" />,
};

export function ServerChannel({ channel, server, role }: ServerChannelProps) {
  const { onOpen } = useModal();
  const router = useRouter();
  const params = useParams();

  return (
    <div>
      <button
        type="button"
        className={cn(
          "group flex w-full items-center justify-between rounded-md px-3 py-2 hover:bg-background",
          params.channelId === channel.id ? "bg-background" : "",
        )}
        onClick={() =>
          router.push(`/servers/${server?.id}/channels/${channel.id}`)
        }
      >
        <p className="flex items-center gap-x-2 text-xs">
          {IconMap[channel.channelType]}
          {channel.channelName}
        </p>

        {channel.channelName !== "general" && role === MemberRole.ADMIN && (
          <div className="ml-auto flex items-center space-x-2">
            <TooltipAction label="Edit">
              <Edit
                onClick={() => onOpen("edit-channel", { server, channel })}
                className="hidden h-4 w-4 text-muted-foreground hover:text-sky-500 group-hover:block"
              />
            </TooltipAction>
            <TooltipAction label="Delete">
              <Trash
                onClick={() => onOpen("delete-channel", { server, channel })}
                className="hidden h-4 w-4 text-muted-foreground hover:text-destructive group-hover:block"
              />
            </TooltipAction>
          </div>
        )}
        {channel.channelName === "general" && (
          <Lock className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
    </div>
  );
}
