import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";
import type { Teacher, Workshop } from "../types/types";
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
  
  if (event.context.userType == "teacher") {
    const teacher = await teachers.getItem(event.context.user.email) as Teacher | null;
  
    const workshops: Array<Workshop> = [];
    for (const id of teacher? teacher.workshops : []) {
      const workshop = await storage.getItem(id) as Workshop;
      if (workshop.id) {
        workshops.push(workshop);
      }
    }
    return workshops;
  } else if (event.context.userType == "user") {
    const workshopsIds = await storage.getKeys();
    const workshops: Array<Workshop> = [];
    for (const id of workshopsIds) {
      const workshop = await storage.getItem(id) as Workshop;
      if (workshop.id && workshop.open) {
        workshops.push(workshop);
      } else if (workshop.id) {
        for (const participant of workshop.participants) {
          if (participant.email === event.context.user.email) {
            workshops.push(workshop);
            break;
          }
        }
      }
    }
    return workshops; 
  } else {
    throw createError({
      statusCode: 401,
      statusMessage: "unauthorized",
    });
  }

});
