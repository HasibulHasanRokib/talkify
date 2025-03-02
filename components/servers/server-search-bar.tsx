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
} from "@/components/ui/command";
import { DialogTitle } from "../ui/dialog";

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
    <>
      <div
        className="my-1 flex items-center space-x-2 px-3 py-1"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" />
        <div className="flex w-full items-center justify-between">
          <p className="text-sm text-muted-foreground">Search</p>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>S
          </kbd>
        </div>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="hidden">Search Dialog</DialogTitle>

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
    </>
  );
}
