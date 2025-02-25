"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
import { createChannelSchema, TCreateChannelSchema } from "@/lib/zod-schema";
import { useMutation } from "@tanstack/react-query";
import { Spinner } from "../spinner";
import { ErrorMessage } from "../error-message";
import { SuccessMessage } from "../success-message";
import { useRouter } from "next/navigation";

import { ChannelType } from "@prisma/client";
import { editChannelAction } from "@/actions/channel-actions";
import { useModal } from "@/hooks/use-modal";

export function EditChannelModal() {
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const router = useRouter();
  const { isOpen, type, onClose, data } = useModal();
  const { server, channel } = data;

  const isModalOpen = isOpen && type === "edit-channel";

  const form = useForm<TCreateChannelSchema>({
    resolver: zodResolver(createChannelSchema),
    defaultValues: {
      channelName: "",
      type: ChannelType.TEXT,
    },
  });

  useEffect(() => {
    form.setValue("channelName", channel?.channelName || "");
    form.setValue("type", channel?.channelType || ChannelType.TEXT);
  }, [channel, form]);

  const {
    isPending,
    data: mutateData,
    mutate,
  } = useMutation({
    mutationKey: ["edit-channel"],
    mutationFn: editChannelAction,
    onSuccess: (data) => {
      if (data.success) {
        router.refresh();
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
        }, 3000);
      }
    },
  });
  if (!server) return null;
  if (!channel) return null;

  const onSubmit = async (values: TCreateChannelSchema) => {
    mutate({ values, serverId: server.id, channelId: channel.id });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={() => onClose()}>
      <DialogContent>
        <div className="mt-3">
          {showMessage && mutateData?.error && (
            <ErrorMessage message={mutateData.error} />
          )}
          {showMessage && mutateData?.success && (
            <SuccessMessage message={mutateData.success} />
          )}
        </div>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Edit your channel
          </DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="channelName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter channel name"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel type</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="capitalize">
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(ChannelType).map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="capitalize"
                          >
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
