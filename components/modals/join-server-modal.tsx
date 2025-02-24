"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { joinServerAction } from "@/actions/server-actions";
import { ErrorMessage } from "../error-message";
import { SuccessMessage } from "../success-message";
import { Spinner } from "../spinner";
import { useRouter } from "next/navigation";

export function JoinServerModal() {
  const [link, setLink] = useState("");
  const [showMessage, setShoMessage] = useState(false);
  const { type, isOpen, onClose } = useModal();

  const router = useRouter();
  const isModalOpen = isOpen && type === "join-server";

  const { data, mutate, isPending } = useMutation({
    mutationKey: ["join-server"],
    mutationFn: joinServerAction,
    onSuccess: (data) => {
      if (data.success) {
        router.push(`/servers/${data.server?.id}`);
        setShoMessage(true);
        setTimeout(() => {
          onClose();
          setShoMessage(false);
        }, 2000);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(link);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <div className="mt-3">
          {showMessage && data?.error && <ErrorMessage message={data.error} />}
          {showMessage && data?.success && (
            <SuccessMessage message={data.success} />
          )}
        </div>
        <DialogHeader>
          <DialogTitle>Join server link</DialogTitle>
          <DialogDescription>
            Paste your server join link here able to join the server
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <form className="space-y-2" onSubmit={handleSubmit}>
              <Input
                onChange={(e) => setLink(e.target.value)}
                required
                placeholder="invite link"
              />
              <DialogFooter>
                <Button disabled={isPending} type="submit">
                  {isPending ? <Spinner /> : "Join"}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
