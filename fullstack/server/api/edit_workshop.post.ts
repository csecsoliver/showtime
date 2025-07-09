import token from "../plugins/token";

import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";
import type { SecureSessionData, SessionData, Workshop } from "../types/types";
// import acquireLock from "../plugins/lock";
// key: id of the group session, value: json of the group session
const storage = createStorage({
  driver: fsDriver({ base: "./workshops/" }),
});
// key: username of the teacher, value: associated group session ids
// const teachers = createStorage({
//   driver: fsDriver({ base: "./teachers/" }),
// });

export default defineEventHandler(async (event) => {
  // const release = await acquireLock(); // Wait for lock

  //try {
  const session = await requireUserSession(event);
  const secureSession = session.secure as SecureSessionData;
  const sessionData = session.user as SessionData;
  if (!session.secure || !token("check", secureSession.apiToken)) {
    throw createError({
      statusCode: 401,
      statusMessage: "unauthorized",
    });
  }
  const body: {id: string, time: string, town: string, open: boolean, location: string} = await readBody(
    event
  );
  if (!(await storage.getItem(body.id.toString()) as Workshop)?.teachers.includes(sessionData.name)) {
    throw createError({
      statusCode: 403,
      statusMessage: "forbidden",
    });
  }
  const workshop: Workshop = {
    id: body.id,
    town: body.town,
    location: body.location,
    time: body.time,
    participants: (await storage.getItem(body.id.toString()) as Workshop)?.participants || [],
    open: body.open,
    teachers: (await storage.getItem(body.id.toString()) as Workshop)?.teachers || [],
  };
  console.log(workshop);
  await storage.setItem(workshop.id.toString(), workshop);
  return { id: workshop.id, message: "Workshop edited successfully" };
});
