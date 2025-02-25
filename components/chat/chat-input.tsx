import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ArrowUp, Plus, Smile } from "lucide-react";

export function ChatInput() {
  return (
    <div className="flex items-center gap-x-3 px-5 pb-5">
      <div className="flex items-center gap-x-2">
        <Button variant={"ghost"} className="border">
          <Plus />
        </Button>
        <Button variant={"ghost"} className="border">
          <Smile />
        </Button>
      </div>
      <Input placeholder="Message # general" />
      <Button type="submit">
        <ArrowUp />
      </Button>
    </div>
  );
}
