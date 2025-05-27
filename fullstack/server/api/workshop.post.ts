import token from "../plugins/token";

import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";
import type { SecureSessionData, SessionData, Workshop } from "../types/types";
import acquireLock from "../plugins/lock";
// key: id of the group session, value: json of the group session
const storage = createStorage({
  driver: fsDriver({ base: "./workshops/" }),
});
// key: username of the teacher, value: associated group session ids
const teachers = createStorage({
  driver: fsDriver({ base: "./teachers/" }),
});



export default defineEventHandler(async (event) => {
  const release = await acquireLock(); // Wait for lock

  try {
    const session = await requireUserSession(event);
    const secureSession = session.secure as SecureSessionData;
    const sessionData = session.user as SessionData;
    if (!session.secure || !token("check", secureSession.apiToken)) {
      throw createError({
        statusCode: 401,
        statusMessage: "unauthorized",
      });
    }
    const body: { date: Date; town: string; open: boolean } = await readBody(event);
    let nextId = await storage.getItem("currentID") as number | null;
    if (nextId === null) {
      nextId = 0;
    }
    nextId++;
    await storage.setItem("currentID", nextId);
    const workshop: Workshop = {
        id: nextId,
        town: body.town,
        location: null,
        time: body.date,
        participants: [],
        open: body.open,
        teachers: [sessionData.name],

    };
    storage.setItem(workshop.id, workshop);
    let workshopIds = await teachers.getItem(sessionData.name) as Array<string> | null;
    if (!workshopIds) {
      workshopIds = [];
    }
    workshopIds.push(workshop.id.toString());
    await teachers.setItem(sessionData.name, workshopIds);
    return { id: workshop.id, message: "Workshop created successfully" };
  } finally {
    release(); // Release lock
  }
});