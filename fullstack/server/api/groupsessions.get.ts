import token from "../plugins/token";

import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";
// key: id of the group session, value: json of the group session
const storage = createStorage({
  driver: fsDriver({ base: "./groupsessions/" }),
});
// key: username of the teacher, value: associated group session ids
const teachers = createStorage({
  driver: fsDriver({ base: "./teachers/" }),
});
// returns all group sessions in json format, list of objects with id, and the other data from the group session
export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  if (!session.secure || !token("check", session.secure.apiToken)) {
    throw createError({
      statusCode: 401,
      statusMessage: "unauthorized",
    });
  }
  const sessionids = await teachers.getItem(session.user.name);
  if (!sessionids) {
    return {};
  }
  const sessions: { [key: string]: {location: string, time: Date, participants: number, open:boolean, teachers: Array<string>, } } = {};
  for (const id of sessionids) {
    const groupSession = await storage.getItem(id);
    if (groupSession) {
      sessions[id] = groupSession;
    }
  }
  return sessions;
});
