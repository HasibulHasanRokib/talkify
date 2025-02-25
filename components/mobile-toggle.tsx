import React from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ServerRootSidebar } from "./servers/server-root-sidebar";
import { ServerMainSidebar } from "./servers/server-main-sidebar";

export function MobileToggle({ serverId }: { serverId: string }) {
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="md:hidden">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"} className="gap-0 p-0">
          <SheetHeader className="hidden">
            <SheetTitle>Mobile toggle</SheetTitle>
            <SheetDescription>Click here.</SheetDescription>
          </SheetHeader>
          <div className="flex min-h-screen">
            <ServerRootSidebar />
            <ServerMainSidebar serverId={serverId} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
