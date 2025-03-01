"use server";

import { db } from "@/lib/prisma";

export async function messageAction(
  page: number,
  limit: number,
  channelId: string,
) {
  return await db.message.findMany({
    where: { channelId },
    include: {
      member: {
        select: {
          profile: true,
        },
      },
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}
