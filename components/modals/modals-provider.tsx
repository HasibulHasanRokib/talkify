import React from "react";
import { ServerCreateModal } from "./server-create-modal";
import { InvitePeopleModal } from "./invite-people-modal";
import { JoinServerModal } from "./join-server-modal";
import { DeleteServerModal } from "./delete-server-modal";

export function ModalsProvider() {
  return (
    <>
      <ServerCreateModal />
      <InvitePeopleModal />
      <JoinServerModal />
      <DeleteServerModal />
    </>
  );
}
