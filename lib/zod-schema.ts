import { ChannelType } from "@prisma/client";
import { z } from "zod";

export const createServerSchema = z.object({
  serverName: z
    .string()
    .min(1, "Required")
    .min(3, "Name must contain at least 3 characters.")
    .max(100),
  imageUrl: z.string().url("Invalid URL"),
});

export type TCreateServerSchema = z.infer<typeof createServerSchema>;

export const createChannelSchema = z.object({
  channelName: z
    .string()
    .min(1, "Required")
    .min(3, "Name must contain at least 3 characters.")
    .max(50)
    .refine((channelName) => channelName !== "general", {
      message: "Channel name cannot be 'General'",
    }),
  type: z.nativeEnum(ChannelType),
});

export type TCreateChannelSchema = z.infer<typeof createChannelSchema>;
