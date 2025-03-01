import { Hash } from "lucide-react";

interface ChatWelcomeProps {
  name: string;
  type: "channel";
}

export function ChatWelcome({ name, type }: ChatWelcomeProps) {
  return (
    <div className="mb-4 space-y-2">
      {type === "channel" && (
        <div className="flex h-[75px] w-[75px] items-center justify-center rounded-full bg-secondary">
          <Hash className="h-12 w-12" />
        </div>
      )}
      <p className="text-xl font-bold md:text-3xl">
        {type === "channel" ? "Welcome to #" : ""}
        {name}
      </p>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {type === "channel"
          ? `This is the start of the #${name} channel`
          : `This is the start your conversation with ${name}`}
      </p>
    </div>
  );
}
