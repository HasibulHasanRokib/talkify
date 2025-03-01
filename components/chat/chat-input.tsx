"use client";

import * as z from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ArrowUp, PlusCircle, Smile } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { socket } from "@/lib/socket";

interface ChatInputProps {
  name: string;
  channelId: string;
  serverId: string;
  memberId: string;
}

interface MessageData {
  content: string;
  channelId: string;
  memberId: string;
  fileUrl?: string;
}
const zodSchema = z.object({
  content: z.string().min(1),
});

export function ChatInput({
  channelId,
  memberId,
  name,
  serverId,
}: ChatInputProps) {
  const form = useForm<z.infer<typeof zodSchema>>({
    resolver: zodResolver(zodSchema),
    defaultValues: {
      content: "",
    },
  });

  if (channelId && serverId && memberId) {
    socket.emit("join_room", channelId);
  }

  const onSubmit = (values: z.infer<typeof zodSchema>) => {
    if (values.content.trim() !== null) {
      const messageData: MessageData = {
        channelId,
        memberId,
        content: values.content,
      };
      socket.emit("send_message", messageData);
      form.reset();
    }
  };
  return (
    <div className="px-5 pb-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center gap-x-3"
        >
          <PlusCircle className="text-muted-foreground" />
          <Smile className="text-muted-foreground" />

          <div className="flex-1">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder={`Message # ${name}`} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">
            <ArrowUp />
          </Button>
        </form>
      </Form>
    </div>
  );
}
