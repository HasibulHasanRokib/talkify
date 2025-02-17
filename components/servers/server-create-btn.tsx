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
        className="m-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white hover:opacity-80"
      >
        <Plus />
      </button>
    </TooltipAction>
  );
}
