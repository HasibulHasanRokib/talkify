import { CurrentProfile } from "@/lib/auth/current-profile";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import React from "react";
import { Separator } from "../ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ServerCreateBtn } from "./server-create-btn";
import { ServerItem } from "./server-item";
import { UserButton } from "@clerk/nextjs";

export async function ServerRootSidebar() {
  const profile = await CurrentProfile();
  if (!profile) return redirect("/sign-in");

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!servers) return redirect("/");

  return (
    <div className="flex flex-col items-center justify-center border-r">
      <ServerCreateBtn />
      <Separator />
      <ScrollArea className="flex-grow">
        {servers.map((server) => (
          <div key={server.id} className="py-4">
            <ServerItem
              id={server.id}
              name={server.serverName}
              imageUrl={server.imageUrl}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="flex flex-col items-center space-y-4 py-4">
        <UserButton
          afterSwitchSessionUrl="/sign-in"
          appearance={{
            elements: {
              avatarBox: "h-[40px] w-[40px]",
            },
          }}
        />
      </div>
    </div>
  );
}
