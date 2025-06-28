import fsDriver from "unstorage/drivers/fs";
import { createStorage } from "unstorage";
import type { InviteBasic, InviteStored, Workshop } from "~/server/types/types";
const invites = createStorage({
  driver: fsDriver({ base: "./workshops/" }),
});
const workshops = createStorage({
  driver: fsDriver({ base: "./workshops/" }),
});
export default defineEventHandler(async (event) => {
  if (!getRouterParam(event, "param")) {
    sendError(
      event,
      createError({
        statusCode: 404,
        statusMessage: "Missing parameter",
      })
    );
  }
  const param: string = getRouterParam(event, "param") as string;
  const invite: InviteStored | null = (await invites.getItem(
    param
  )) as InviteStored | null;
  if (!invite) {
    sendError(
      event,
      createError({
        statusCode: 404,
        statusMessage: "Invite not found",
      })
    );
    return;
  }
  const data = {
    id: invite.id,
    invitor: invite.invitor,
    date: (await workshops.getItem(invite.workshopId) as Workshop).time,
  } as InviteBasic;
  console.log(data);
  return data;
});
