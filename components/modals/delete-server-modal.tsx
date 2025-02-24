"use client";

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
import { useModal } from "@/hooks/use-modal";
import { Spinner } from "../spinner";
import { useMutation } from "@tanstack/react-query";
import { deleteServerAction } from "@/actions/server-actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function DeleteServerModal() {
  const router = useRouter();
  const { onClose, type, isOpen, data } = useModal();
  const { server } = data;
  const { toast } = useToast();

  const isModalOpen = isOpen && type === "delete-server";

  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-server"],
    mutationFn: deleteServerAction,

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

  if (!server) return null;

  return (
    <AlertDialog open={isModalOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the{" "}
            <span className="font-semibold capitalize text-primary">
              {server?.serverName}
            </span>{" "}
            server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => mutate(server.id)}
            disabled={isPending}
          >
            {isPending ? <Spinner /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
