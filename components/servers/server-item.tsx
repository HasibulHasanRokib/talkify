"use client";

import Image from "next/image";
import React from "react";
import { TooltipAction } from "../tooltip-action";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ServerItemProps {
  id: string;
  name: string;
  imageUrl: string;
}
export function ServerItem({ id, imageUrl, name }: ServerItemProps) {
  const router = useRouter();
  const params = useParams();

  return (
    <TooltipAction label={name} aline="center" side="right">
      <div
        className={cn(
          "relative h-12 w-12 overflow-hidden border shadow-md transition-all hover:rounded-2xl",
          params?.serverId === id
            ? "rounded-2xl ring-2 ring-primary"
            : "rounded-full",
        )}
      >
        <button type="button" onClick={() => router.push(`/servers/${id}`)}>
          <Image fill src={imageUrl} alt="image" className="object-cover" />
        </button>
      </div>
    </TooltipAction>
  );
}
