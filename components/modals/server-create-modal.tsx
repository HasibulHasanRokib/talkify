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
import { createServerAction } from "@/actions/server-actions";
import { Spinner } from "../spinner";
import { ErrorMessage } from "../error-message";
import { SuccessMessage } from "../success-message";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal";

export function ServerCreateModal() {
  const { isOpen, type, onClose } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "create-modal";

  const form = useForm<TCreateServerSchema>({
    resolver: zodResolver(createServerSchema),
    defaultValues: {
      serverName: "",
      imageUrl: "",
    },
  });

  const { mutate, isPending, data } = useMutation({
    mutationKey: ["create-server"],
    mutationFn: createServerAction,
    onSuccess: (data) => {
      if (data.success) {
        form.reset();
        router.push(`/servers/${data.newServer.id}`);
        onClose();
      }
    },
  });

  const onSubmit = async (values: TCreateServerSchema) => {
    mutate(values);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={() => onClose()}>
      <DialogContent>
        <div className="mt-3">
          {data?.error && <ErrorMessage message={data.error} />}
          {data?.success && <SuccessMessage message={data.success} />}
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
                  {isPending ? <Spinner text="Creating" /> : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
