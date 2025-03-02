"use client";
import { messageAction } from "@/actions/message-actions";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { Button } from "../ui/button";
import { UserAvatar } from "../user-avatar";
import { cn } from "@/lib/utils";
import { Spinner } from "../spinner";
import { ErrorMessage } from "../error-message";
import { Trash } from "lucide-react";

export function ChatMessage({
  channelId,
  profileId,
}: {
  channelId: string;
  profileId: string;
}) {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["messages", channelId],
    queryFn: async ({ pageParam }) => messageAction(pageParam, 5, channelId),
    initialPageParam: 1,
    refetchInterval: 1000,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 5 ? allPages.length + 1 : undefined,
  });

  if (status === "pending")
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner text="Loading..." />
      </div>
    );
  if (status === "error") return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="text-center">
        <Button
          variant={"outline"}
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
          className={cn(!hasNextPage ? "hidden" : "")}
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
              ? "Load Older Messages"
              : "Load Older Messages"}
        </Button>
      </div>

      <div className={cn("flex flex-col-reverse gap-y-3")}>
        {data.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.map((message) => {
              const isCurrentUser = message.member?.profile?.id === profileId;
              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    isCurrentUser ? "justify-end" : "justify-start",
                  )}
                >
                  <div className="flex items-start gap-x-2">
                    {!isCurrentUser && (
                      <UserAvatar
                        className="h-8 w-8"
                        url={message.member?.profile?.imageUrl}
                      />
                    )}
                    <div
                      className={cn(
                        "group flex items-center gap-x-1 transition-all",
                        isCurrentUser ? "flex-row-reverse" : "",
                      )}
                    >
                      <div className="rounded-full border bg-muted p-2 text-sm">
                        {message.content}
                      </div>
                      <p className="hidden items-center gap-x-2 text-xs group-hover:flex">
                        {message.createdAt.toLocaleDateString()}
                        <Trash className="h-4 w-4 text-destructive" />
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
