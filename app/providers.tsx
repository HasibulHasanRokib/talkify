"use client";
import { SocketContextProvider } from "@/context/socket-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <SocketContextProvider>{children}</SocketContextProvider>
    </QueryClientProvider>
  );
}
