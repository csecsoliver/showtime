import fsDriver from "unstorage/drivers/fs";
import { createStorage } from "unstorage";
import transporter from "~/server/plugins/email";
import type { InviteStored, Teacher, Workshop } from "~/server/types/types";
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
        statusMessage: "badRequest",
      })
    );
  }
  if (event.context.userType !== "user") {
    sendError(
      event,
      createError({
        statusCode: 401,
        statusMessage: "unauthorized",
      })
    );
    return;
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
        statusMessage: "inviteNotFound",
      })
    );
    return;
  }
  const body = (await readBody(event)) as { name: string; email: string };
  if (typeof body !== "object" || !body || !body.email || !body.name) {
    sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "badRequest",
      })
    );
    return;
  }
  const workshop = (await workshops.getItem(invite.workshopId)) as Workshop;
  if (workshop.participants.length >= 18) {
    sendError(
      event,
      createError({
        statusCode: 403,
        statusMessage: "inviteClosedError",
      })
    );
    return;
  }
  const teacher = (await teachers.getItem(invite.invitor)) as Teacher;


  for (let index = 0; index < workshop.participants.length; index++) {
    const participant = workshop.participants[index];
    if (participant.email === body.email) {
      if (!participant.name) {
        workshop.participants[index].name = body.name;
        workshop.participants[index].confirmed = true;
        await workshops.setItem(invite.workshopId, workshop);
        await transporter().sendMail({
          from: "showtime.coe@gmail.com",
          to: teacher.email,
          subject: `Új résztvevő - ${body.name}`,
          text: `${body.email} megerősítette ${body.name} részvételét.`,
        });

        return workshop.participants[index];
      } else if (participant.name !== body.name) {
        workshop.participants.push({
          email: body.email,
          name: body.name,
          confirmed: true,
        });
        await workshops.setItem(invite.workshopId, workshop);
        await transporter().sendMail({
          from: "showtime.coe@gmail.com",
          to: teacher.email,
          subject: `Új résztvevő - ${body.name}`,
          text: `${body.email} megerősítette ${body.name} részvételét.`,
        });
        return workshop.participants[workshop.participants.length - 1];
      } else {
        sendError(
          event,
          createError({
            statusCode: 403,
            statusMessage: "existsError",
          })
        );
        return;
      }
    }
  }
  if (workshop.open) {
    workshop.participants.push({
      email: body.email,
      name: body.name,
      confirmed: true,
    });
    await workshops.setItem(invite.workshopId, workshop);
    await transporter().sendMail({
      from: "showtime.coe@gmail.com",
      to: teacher.email,
      subject: `Új résztvevő - ${body.name}`,
      text: `${body.email} kezdeményezte ${body.name} részvételét.`,
    });
    return workshop.participants[workshop.participants.length - 1];
  } else {
    sendError(
      event,
      createError({
        statusCode: 403,
        statusMessage: "workshopClosedError",
      })
    );
    return;
  }
});
