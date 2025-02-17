import { ServerRootSidebar } from "@/components/servers/server-root-sidebar";
import React, { ReactNode } from "react";
interface ServerIdPageProps {
  children: ReactNode;
}
export default function ServerIdLayout({ children }: ServerIdPageProps) {
  return (
    <div className="flex min-h-screen">
      <ServerRootSidebar />
      {children}
    </div>
  );
}
