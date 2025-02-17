import { ServerMainSidebar } from "@/components/servers/server-main-sidebar";
import { ServerRootSidebar } from "@/components/servers/server-root-sidebar";
import { CurrentProfile } from "@/lib/auth/current-profile";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
interface ServerIdPageProps {
  children: ReactNode;
  params: Promise<{ serverId: string }>;
}
export default async function ServerIdLayout({
  children,
  params,
}: ServerIdPageProps) {
  const serverId = (await params).serverId;
  const profile = await CurrentProfile();

  if (!profile) return redirect("/sign-in");

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  if (!server) return redirect("/");
  return (
    <div className="flex min-h-screen">
      <ServerRootSidebar />
      <ServerMainSidebar serverId={serverId} />
      {children}
    </div>
  );
}
