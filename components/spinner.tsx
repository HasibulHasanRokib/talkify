import { Loader2 } from "lucide-react";
import React from "react";

export function Spinner({ text }: { text?: string }) {
  return (
    <div className="flex items-center justify-center gap-x-2">
      <Loader2 className="animate-spin" />
      <p className="text-sm">{text}</p>
    </div>
  );
}
