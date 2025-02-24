"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useModal } from "@/hooks/use-modal";
import { Spinner } from "../spinner";
import {
  Check,
  MoreVertical,
  ShieldAlert,
  ShieldCheck,
  UserMinus,
} from "lucide-react";
import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { UserAvatar } from "../user-avatar";
import { useMutation } from "@tanstack/react-query";
import { manageMemberAction } from "@/actions/server-actions";
import { ErrorMessage } from "../error-message";
import { SuccessMessage } from "../success-message";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ROLEMAP = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 text-primary" />,
  ADMIN: <ShieldAlert className="h-4 w-4 text-destructive" />,
  KICK: null,
};

export function ManageMemberModal() {
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const router = useRouter();
  const { isOpen, type, data, onClose, onOpen } = useModal();
  const isModalOpen = isOpen && type === "manage-member";
  const { server } = data as {
    server: Server & { members: (Member & { profile: Profile | null })[] };
  };
  const {
    mutate,
    isPending,
    data: mutateData,
  } = useMutation({
    mutationKey: ["manage-member"],
    mutationFn: manageMemberAction,
    onSuccess: (data) => {
      if (data.success) {
        router.refresh();
        onOpen("manage-member", { server: data.updateMember });
        setShowMessage(true);

        setTimeout(() => {
          setShowMessage(false);
        }, 3000);
      }
    },
  });

  const handleChange = (memberId: string, newRole: MemberRole) => {
    mutate({ memberId, newRole, serverId: server.id });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <div>
          {showMessage && mutateData?.error && (
            <ErrorMessage message={mutateData.error} />
          )}
          {showMessage && mutateData?.success && (
            <SuccessMessage message={mutateData.success} />
          )}
        </div>
        <div>
          <ScrollArea className="max-h-[420px] p-2">
            {server?.members?.map((member) => (
              <div key={member.id} className="mb-6 flex items-center gap-x-3">
                <UserAvatar
                  url={member.profile?.imageUrl}
                  className="border shadow"
                  name={member.profile?.name}
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-x-2 capitalize">
                    {member.profile?.name}
                    {ROLEMAP[member.role]}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {member.profile?.email}
                  </p>
                </div>
                {member.id && member.role !== "ADMIN" && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        {isPending ? (
                          <Spinner />
                        ) : (
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        )}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right">
                        <DropdownMenuLabel>Select role</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleChange(member.id, "GUEST")}
                        >
                          Guest{" "}
                          {member.role === "GUEST" ? (
                            <Check className="ml-auto text-primary" />
                          ) : (
                            ""
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleChange(member.id, "MODERATOR")}
                        >
                          Moderator{" "}
                          {member.role === "MODERATOR" ? (
                            <Check className="ml-auto text-primary" />
                          ) : (
                            ""
                          )}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleChange(member.id, "KICK")}
                        >
                          <UserMinus />
                          <span>Kick</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            ))}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
