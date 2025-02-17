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
        onClick={() => {}}
        className="flex h-12 w-12 items-center justify-center rounded-2xl border bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80"
      >
        <Server className="h-5 w-5" />
      </button>
    </TooltipAction>
  );
}
