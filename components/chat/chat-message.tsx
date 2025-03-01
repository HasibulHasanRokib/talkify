"use client";
import { messageAction } from "@/actions/message-actions";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { Button, buttonVariants } from "../ui/button";
import { UserAvatar } from "../user-avatar";
import { cn } from "@/lib/utils";
import { Spinner } from "../spinner";
import { ErrorMessage } from "../error-message";

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
      <div className="flex h-full w-full items-center justify-center">
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
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={cn(
                          buttonVariants({
                            variant: isCurrentUser ? "default" : "outline",
                          }),
                          isCurrentUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted",
                        )}
                      >
                        {message.content}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {message.createdAt.toLocaleTimeString()}
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
