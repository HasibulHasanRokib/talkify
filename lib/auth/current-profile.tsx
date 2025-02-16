import { auth } from "@clerk/nextjs/server";
import { db } from "../prisma";

export async function CurrentProfile() {
  const { userId } = await auth();

  if (!userId) return null;

  const currentProfile = await db.profile.findFirst({
    where: {
      userId,
    },
  });

  return currentProfile;
}
