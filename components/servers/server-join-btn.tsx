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
        className="m-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white hover:opacity-80"
      >
        <Server className="h-5 w-5 text-slate-300" />
      </button>
    </TooltipAction>
  );
}
