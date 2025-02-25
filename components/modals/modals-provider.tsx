import React from "react";
import { ServerCreateModal } from "./server-create-modal";
import { InvitePeopleModal } from "./invite-people-modal";
import { JoinServerModal } from "./join-server-modal";
import { DeleteServerModal } from "./delete-server-modal";
import ServerSettingModal from "./server-setting-modal";
import { ManageMemberModal } from "./manage-member-modal";
import { CreateChannelModal } from "./create-channel-modal";
import LeaveServerModal from "./leave-server-modal";
import { EditChannelModal } from "./edit-channel-modal";
import { DeleteChannelModal } from "./delete-channel-modal";

export function ModalsProvider() {
  return (
    <>
      <ServerCreateModal />
      <InvitePeopleModal />
      <JoinServerModal />
      <DeleteServerModal />
      <ServerSettingModal />
      <ManageMemberModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <EditChannelModal />
      <DeleteChannelModal />
    </>
  );
}
