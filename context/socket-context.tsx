"use client";

import { useUser } from "@clerk/clerk-react";
import { Profile } from "@prisma/client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { io, Socket } from "socket.io-client";

interface ISocketContext {
  onLineUsers: IOnlineUsers[] | null;
}

interface IOnlineUsers {
  socketId: string;
  profile: Profile;
}

export const SocketContext = createContext<ISocketContext | null>(null);

export const SocketContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { user } = useUser();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [onLineUsers, setOnLineUsers] = useState<IOnlineUsers[] | null>(null);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (socket === null) return;
    if (socket.connected) {
      onConnect();
    }
    function onConnect() {
      setIsConnected(true);
    }
    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.emit("add-new-user", user?.id);
    socket.on("get-users", (res) => {
      setOnLineUsers(res);
    });

    return () => {
      socket.off("get-users", (res) => {
        setOnLineUsers(res);
      });
    };
  }, [socket, isConnected, user]);

  return (
    <SocketContext.Provider value={{ onLineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketContextProvide");
  }
  return context;
};
