"use client";

import { leaveServerAction } from "@/actions/server-actions";
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

export default function LeaveServerModal() {
  const router = useRouter();
  const { isOpen, onClose, data, type } = useModal();

  const isModalOpen = isOpen && type === "leave-server";
  const { server } = data;
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationKey: ["leave-server"],
    mutationFn: leaveServerAction,
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
    <AlertDialog open={isModalOpen} onOpenChange={() => onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete you from{" "}
            <span className="font-semibold capitalize">
              {server?.serverName}
            </span>{" "}
            server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => mutate(server.id)}>
            {isPending ? <Spinner /> : "Leave"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
