"use client";
import React from "react";
import { Plus } from "lucide-react";
import { TooltipAction } from "../tooltip-action";
import { useModal } from "@/hooks/use-modal";

export function ServerCreateBtn() {
  const { onOpen } = useModal();
  return (
    <TooltipAction label="Create server" side="right" aline="center">
      <button
        onClick={() => onOpen("create-modal")}
        className="m-3 flex h-12 w-12 items-center justify-center rounded-2xl border bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/90"
      >
        <Plus className="h-6 w-6" />
      </button>
    </TooltipAction>
  );
}
