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
      <button type="button" onClick={() => router.push(`/server/${id}`)}>
        <div
          className={cn(
            "relative mx-3 flex h-10 w-10 overflow-hidden rounded-2xl transition-all hover:ring-2 hover:ring-primary hover:ring-offset-1",
            params?.serverId === id
              ? "rounded-2xl ring-2 ring-primary ring-offset-2"
              : "ring-transparent",
          )}
        >
          <Image
            fill
            src={imageUrl}
            alt="image"
            className="rounded-2xl object-cover"
          />
        </div>
      </button>
    </TooltipAction>
  );
}
