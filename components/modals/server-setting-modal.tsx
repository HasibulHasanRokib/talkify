"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { FileUpload } from "../file-upload";
import { createServerSchema, TCreateServerSchema } from "@/lib/zod-schema";
import { useMutation } from "@tanstack/react-query";
import { Spinner } from "../spinner";

import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal";
import { editServerAction } from "@/actions/server-actions";
import { ErrorMessage } from "../error-message";
import { SuccessMessage } from "../success-message";

export default function ServerSettingModal() {
  const { isOpen, type, onClose, data } = useModal();
  const { server } = data;
  const router = useRouter();

  const isModalOpen = isOpen && type === "server-setting";

  const form = useForm<TCreateServerSchema>({
    resolver: zodResolver(createServerSchema),
    defaultValues: {
      serverName: server?.serverName,
      imageUrl: server?.imageUrl,
    },
  });

  const {
    mutate,
    isPending,
    data: mutateData,
  } = useMutation({
    mutationKey: ["edit-server"],
    mutationFn: editServerAction,
    onSuccess: (data) => {
      if (data.success) {
        router.refresh();
      }
    },
  });

  if (!server) return null;

  const onSubmit = async (values: TCreateServerSchema) => {
    mutate({ values, serverId: server.id });
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={() => onClose()}>
      <DialogContent>
        <div className="mt-3">
          {mutateData?.error && <ErrorMessage message={mutateData.error} />}
          {mutateData?.success && (
            <SuccessMessage message={mutateData.success} />
          )}
        </div>
        <DialogHeader>
          <DialogTitle className="text-2xl">Create your server</DialogTitle>
          <DialogDescription>
            Give your server a personality with a name an image. You can always
            change it later.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUpload
                        isPending={isPending}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serverName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Server name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter server name"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button disabled={isPending} type="submit">
                  {isPending ? <Spinner text="Updating" /> : "Update"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
