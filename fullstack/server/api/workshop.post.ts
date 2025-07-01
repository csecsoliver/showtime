import token from "../plugins/token";

import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";
import type { SecureSessionData, SessionData, Teacher, Workshop } from "../types/types";
// import acquireLock from "../plugins/lock";
// key: id of the group session, value: json of the group session
const storage = createStorage({
  driver: fsDriver({ base: "./workshops/" }),
});
// key: username of the teacher, value: associated group session ids
const teachers = createStorage({
  driver: fsDriver({ base: "./teachers/" }),
});

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
  const body: { date: Date; town: string; open: string } = await readBody(
    event
  );
  
  let nextId = (await storage.getItem("currentID")) as string | null | number;
  if (nextId === null) {
    nextId = 0;
  }
  nextId = parseInt(`${nextId}`) + 1;
  await storage.setItem("currentID", nextId);
  const workshop: Workshop = {
    id: nextId.toString(),
    town: body.town,
    location: null,
    time: body.date,
    participants: [],
    open: body.open == "on" ? true : false,
    teachers: [sessionData.name],
  };
  await storage.setItem(workshop.id.toString(), workshop);
  let teacher = (await teachers.getItem(
    sessionData.name
  )) as Teacher | null;
  if (!teacher) {
    teacher = {email: sessionData.name, workshops: []} as Teacher; // Initialize teacher object if it doesn't exist
  }
  teacher.workshops.push(workshop.id.toString());
  await teachers.setItem(sessionData.name, teacher);
  return { id: workshop.id, message: "Workshop created successfully" };
  //}  finally {
  //   release(); // Release lock
  // }
});