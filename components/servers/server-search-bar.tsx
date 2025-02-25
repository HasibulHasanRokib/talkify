"use client";
import { Search } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { Button } from "../ui/button";

interface ServerSearchBarProps {
  data: {
    label: string;
    type: "channel" | "member";
    data:
      | {
          icon: ReactNode;
          name?: string;
          id: string;
        }[]
      | undefined;
  }[];
}
export function ServerSearchBar({ data }: ServerSearchBarProps) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  return (
    <div>
      <Button
        variant={"outline"}
        className="w-full hover:bg-background focus-visible:ring-0"
        type="button"
        onClick={() => setOpen(true)}
      >
        <span className="flex items-center space-x-2">
          <Search className="h-4 w-4" />
          <p className="text-sm">Search</p>
        </span>
        <CommandShortcut>⌘S</CommandShortcut>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search channels  or members..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {data.map((item) => {
            if (!item.data?.length) return null;
            return (
              <CommandGroup
                key={item.label}
                heading={item.label}
                className="py-3"
              >
                {item.data.map(({ id, icon, name }) => {
                  return (
                    <CommandItem key={id}>
                      {icon} <span>{name}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </div>
  );
}
