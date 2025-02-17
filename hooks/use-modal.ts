import { Channel, ChannelType, Server } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "create-modal"
  | "invite-people"
  | "create-channel"
  | "manage-member"
  | "server-setting"
  | "leave-server"
  | "delete-server"
  | "delete-channel"
  | "edit-channel";

interface ModalData {
  server?: Server;
  channelType?: ChannelType;
  channel?: Channel;
}

interface Modal {
  type: ModalType | null;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
  data: ModalData;
}

export const useModal = create<Modal>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null }),
}));
