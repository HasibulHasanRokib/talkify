import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function UserAvatar({
  url,
  className,
  name,
}: {
  url?: string;
  className?: ReactNode;
  name?: string;
}) {
  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={url} />
      <AvatarFallback>{name}</AvatarFallback>
    </Avatar>
  );
}
