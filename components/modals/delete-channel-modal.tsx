"use client";

import { deleteChannelAction } from "@/actions/channel-actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Spinner } from "../spinner";
import { useModal } from "@/hooks/use-modal";
import { useToast } from "@/hooks/use-toast";

export function DeleteChannelModal() {
  const router = useRouter();
  const { onClose, isOpen, type, data } = useModal();
  const { server, channel } = data;
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-channel"],
    mutationFn: deleteChannelAction,
    onSuccess: (data) => {
      if (data?.success) {
        toast({
          title: "Success",
          description: data.success,
          variant: "default",
        });
        router.refresh();
        onClose();
      } else if (data?.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
      }
    },
  });
  const isModalOpen = isOpen && type === "delete-channel";
  if (!server) return null;
  if (!channel) return null;

  return (
    <AlertDialog open={isModalOpen} onOpenChange={() => onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your{" "}
            <span className="font-semibold capitalize text-primary">
              {channel?.channelName}
            </span>{" "}
            channel.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              mutate({ serverId: server.id, channelId: channel.id })
            }
          >
            {isPending ? <Spinner /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
