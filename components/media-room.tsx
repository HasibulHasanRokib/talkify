"use client";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  VideoConference,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useEffect, useState } from "react";
import { Spinner } from "./spinner";
import { useUser } from "@clerk/nextjs";

export function MediaRoom({
  chatId,
  audio,
  video,
}: {
  chatId: string;
  audio: boolean;
  video: boolean;
}) {
  const { user } = useUser();
  const [token, setToken] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!user?.firstName || !user.lastName) return;

    const name = `${user.firstName} ${user.lastName}`;
    const fetchToken = async () => {
      try {
        const resp = await fetch(
          `/api/livekit?room=${chatId}&username=${name}`,
        );
        if (!resp.ok) throw new Error("Token fetch failed");
        const data = await resp.json();
        setToken(data.token);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to connect to media server");
        setToken("");
      }
    };
    fetchToken();
  }, [user?.firstName, user?.lastName, chatId]);

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner />
        Connecting to media server...
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={video}
      audio={audio}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
      connectOptions={{ autoSubscribe: true }}
    >
      <VideoConference />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}
