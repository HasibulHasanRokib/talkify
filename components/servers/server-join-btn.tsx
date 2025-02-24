"use client";
import React from "react";
import { Server } from "lucide-react";
import { TooltipAction } from "../tooltip-action";
import { useModal } from "@/hooks/use-modal";

export function ServerJoinBtn() {
  const { onOpen } = useModal();
  return (
    <TooltipAction label="Join server" side="right" aline="center">
      <button
        onClick={() => onOpen("join-server")}
        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
      >
        <Server className="h-5 w-5" />
      </button>
    </TooltipAction>
  );
}
