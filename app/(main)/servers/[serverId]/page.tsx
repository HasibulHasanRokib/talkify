import { CurrentProfile } from "@/lib/auth/current-profile";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ServerIdPage({
  params,
}: {
  params: Promise<{ serverId: string }>;
}) {
  const serverId = (await params).serverId;

  const profile = await CurrentProfile();

  if (!profile) redirect("/sign-in");

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          channelName: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const initialChannel = server?.channels[0];
  if (initialChannel?.channelName !== "general") {
    return null;
  }

  return redirect(`/servers/${serverId}/channels/${initialChannel.id}`);
}
