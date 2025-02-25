import React from "react";
import { ChatWelcome } from "./chat-welcome";

interface ChatMessageProps {
  name: string;
  type: "channel";
}
export function ChatMessage({ name, type }: ChatMessageProps) {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 py-4">
      <div className="flex-1">
        <ChatWelcome name={name} type={type} />
      </div>
    </div>
  );
}
