"use client";

import { Channel, Member, MemberRole, Profile, Server } from "@prisma/client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";

import { useModal } from "@/hooks/use-modal";
import { Button } from "../ui/button";

interface SidebarHeaderProps {
  server: Server & {
    members: (Member & { profile: Profile | null })[];
    channels: Channel[];
  };
  role?: MemberRole;
}

export function ServerSidebarHeader({ server, role }: SidebarHeaderProps) {
  const { onOpen } = useModal();

  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="focus:outline-none">
        <Button
          variant={"outline"}
          className="w-full hover:bg-background focus-visible:ring-0"
        >
          <p className="font-semibold capitalize">{server.serverName}</p>
          <ChevronDown className="ml-auto h-5 w-5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs">
        {isModerator && (
          <>
            <DropdownMenuItem
              onClick={() => onOpen("invite-people", { server })}
              className="cursor-pointer"
            >
              Invite People
              <UserPlus className="ml-auto h-4 w-4" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onOpen("create-channel", { server })}
              className="cursor-pointer"
            >
              Create Channel
              <PlusCircle className="ml-auto h-4 w-4" />
            </DropdownMenuItem>
          </>
        )}
        {isAdmin && (
          <>
            <DropdownMenuItem
              onClick={() => onOpen("manage-member", { server })}
              className="cursor-pointer"
            >
              Manage Members
              <Users className="ml-auto h-4 w-4" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onOpen("server-setting", { server })}
              className="cursor-pointer"
            >
              Server Setting
              <Settings className="ml-auto h-4 w-4" />
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onOpen("delete-server", { server })}
              className="cursor-pointer"
            >
              Delete Server <Trash className="ml-auto h-4 w-4" />
            </DropdownMenuItem>
          </>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("leave-server", { server })}
            className="cursor-pointer"
          >
            Leave Server <LogOut className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
