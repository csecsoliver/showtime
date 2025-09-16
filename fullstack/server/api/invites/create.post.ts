import fsDriver from "unstorage/drivers/fs";
import { createStorage } from "unstorage";
import type { InviteStored, SecureSessionData, SessionData } from "~/server/types/types";
import token from "~/server/plugins/token";
import { randomInt } from "crypto";
const invites = createStorage({
  driver: fsDriver({ base: "./invites/" }),
});
const workshops = createStorage({
  driver: fsDriver({ base: "./workshops/" }),
});
export default defineEventHandler(async (event) => {
  const body = await readBody(event) as InviteStored;
  const session = await requireUserSession(event);
  const secureSession = session.secure as SecureSessionData;
  const sessionData = session.user as SessionData;
  if (!session.secure || !token("check", secureSession.apiToken)) {
    throw createError({
      statusCode: 401,
      statusMessage: "unauthorized",
    });
    return;
  }
  if (!body.workshopId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing workshopId",
    });
  }
  let nextId = (await invites.getItem("currentID")) as string | null | number;
  if (nextId === null) {
    nextId = 0;
  }
  nextId = parseInt(`${nextId}`) + randomInt(400) + 1;
  await invites.setItem("currentID", nextId);
  if (!(await workshops.has(body.workshopId))) {
    throw createError({
      statusCode: 404,
      statusMessage: "Workshop not found",
    });
  }
  const invite: InviteStored = {
    id: nextId.toString(),
    invitor: sessionData.name,
    workshopId: body.workshopId,
    custom: body.custom,
  };
  invites.setItem(invite.id, invite);
  return invite;

});
