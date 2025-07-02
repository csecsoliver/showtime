import fsDriver from "unstorage/drivers/fs";
import { createStorage } from "unstorage";
import type { InviteBasic, InviteDetails, InviteStored, Teacher, Workshop } from "~/server/types/types";
const invites = createStorage({
  driver: fsDriver({ base: "./invites/" }),
});
const workshops = createStorage({
  driver: fsDriver({ base: "./workshops/" }),
});
const teachers = createStorage({
  driver: fsDriver({ base: "./teachers/" }),
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
  console.log(`Fetching invite with ID: ${param}`);
  const invite: InviteStored | null = (await invites.getItem(
    param as string
  )) as InviteStored | null;
  console.log(`Invite found: ${invite}`);
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
  if (event.context.userType !== "user") {
    const data = {
      id: invite.id,
      invitor: invite.invitor,
      date: ((await workshops.getItem(invite.workshopId)) as Workshop).time,
    } as InviteBasic;
    console.log(data);
    return data;
  } else {
    const workshop = (await workshops.getItem(invite.workshopId)) as Workshop;
    const teacher = (await teachers.getItem(invite.invitor)) as Teacher;
    teacher.password = undefined; // Do not send password back
    // teacher.salt = undefined; // Do not send salt back
    const data = {
      id: invite.id,
      teacher: teacher,
      workshop: workshop,
      email: teacher.email,
    } as InviteDetails;
    console.log(data);
    return data;
  }
});
