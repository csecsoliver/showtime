import token from "../plugins/token";
import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";
import type { SecureSessionData, SessionData, Teacher, Workshop } from "../types/types";
// key: id of the group session, value: json of the group session
const storage = createStorage({
  driver: fsDriver({ base: "./workshops/" }),
});
// key: username of the teacher, value: associated group session ids
const teachers = createStorage({
  driver: fsDriver({ base: "./teachers/" }),
});
// returns all group sessions in json format, list of objects with id, and the other data from the group session
export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const sessionData = session.user as SessionData;
  const secureSession = session.secure as SecureSessionData;
  if (!secureSession || !token("check", secureSession.apiToken)) {
    throw createError({
      statusCode: 401,
      statusMessage: "unauthorized",
    });
  }
  const teacher = await teachers.getItem(sessionData.name) as Teacher | null;
  
  const workshops: Array<Workshop> = [];
  for (const id of teacher? teacher.workshops : []) {
    const workshop = await storage.getItem(id) as Workshop;
    if (workshop) {
      workshops.push(workshop);
    }
  }
  return workshops;
});
