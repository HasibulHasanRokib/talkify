"use client";

import {
  Channel,
  ChannelType,
  Member,
  MemberRole,
  Profile,
  Server,
} from "@prisma/client";
import { TooltipAction } from "../tooltip-action";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal";

interface ServerSectionProps {
  label: string;
  sectionType: "channel" | "member";
  channelType?: ChannelType;
  role?: MemberRole;
  server?: Server & {
    members: (Member & { profile: Profile | null })[];
    channels: Channel[];
  };
}

export function ServerSection({
  label,
  sectionType,
  channelType,
  role,
  server,
}: ServerSectionProps) {
  const { onOpen } = useModal();
  return (
    <div className="flex items-center justify-between p-2">
      <p className="text-sm">{label}</p>
      {role !== MemberRole.GUEST && sectionType === "channel" && (
        <TooltipAction label="Create Channel">
          <button
            type="button"
            onClick={() => onOpen("create-channel", { channelType, server })}
          >
            <Plus className="h-4 w-4" />
          </button>
        </TooltipAction>
      )}
      {role === MemberRole.ADMIN && sectionType === "member" && (
        <TooltipAction label="Manage Member">
          <button
            type="button"
            onClick={() => onOpen("manage-member", { server })}
          >
            <Settings className="h-4 w-4" />
          </button>
        </TooltipAction>
      )}
    </div>
  );
}
