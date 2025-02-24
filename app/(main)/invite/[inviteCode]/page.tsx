import { CurrentProfile } from "@/lib/auth/current-profile";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";

interface InviteCodepageProps {
  params: Promise<{ inviteCode: string }>;
}

export default async function InviteCodepage({ params }: InviteCodepageProps) {
  const inviteCode = (await params).inviteCode;
  const profile = await CurrentProfile();

  if (!profile) return redirect("/sign-in");

  const serverExist = await db.server.findFirst({
    where: {
      inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (serverExist) return redirect(`/servers/${serverExist.id}`);
  const server = await db.server.update({
    where: { inviteCode },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  if (server) return redirect(`/servers/${server.id}`);

  return null;
}
