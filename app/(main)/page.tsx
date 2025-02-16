import { InitialModal } from "@/components/modals/initial-modal";
import { InitialProfile } from "@/lib/auth/initial-profile";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Home() {
  const profile = await InitialProfile();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return (
    <div>
      <InitialModal />
    </div>
  );
}
