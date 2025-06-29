
import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";
import transporter from "~/server/plugins/email";
import type { InviteStored, Participant, SessionData, User, Workshop } from "~/server/types/types";
const invites = createStorage({
  driver: fsDriver({base: "./invites"})
})
const workshops = createStorage({
  driver: fsDriver({base: "./workshops"})
})
const users = createStorage({
  driver: fsDriver({base: "./users"})
})
export default defineEventHandler(async (event) => {
  const body = await readBody(event) as string[];
  if (!body || !Array.isArray(body) || body.length === 0) {
    sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Invalid request body",
      })
    );
    return;
  }
  const session = await requireUserSession(event);
  const sessionData = session.user as SessionData;
  if (event.context.userType != "teacher") {
    throw createError({
      statusCode: 401,
      statusMessage: "unauthorized",
    });
  }
  if (!getRouterParam(event, "id")) {
    sendError(
      event,
      createError({
        statusCode: 404,
        statusMessage: "Missing parameter",
      })
    );
  }
  const invite = await invites.getItem((getRouterParam(event, "id") as string)) as InviteStored;
  if (!invite) {
    sendError( event, createError({
      statusCode: 404,
      statusMessage: "Invite not found",
    }))
  }
  console.log(body)
  for (const e of body) {
    console.log(await transporter().sendMail({
      from: "showtime.coe@gmail.com",
      to: e,
      subject: `Meghívó foglalkozásre ${sessionData.name} által`,
      text: `Meghívót kaptál a foglalkozásra. Kérlek, használd az alábbi linket a meghívó megtekintéséhez:\n\nhttps://show-time.ddns.net/invite/${invite.id}\n\nÜdvözlettel,\n${sessionData.name}`,
    }));
    workshops.setItem(invite.workshopId, {
      ...await workshops.getItem(invite.workshopId) as Workshop,
      participants: [
        ...(await workshops.getItem(invite.workshopId) as Workshop).participants,
        {
          email: e,
          confirmed: false
        } as Participant
      ]
    });
    users.setItem(e, {
      ...await users.getItem(e) as User,
      workshops: [
        ...(await users.getItem(e) as User).workshops,
        invite.workshopId
      ]
    });

  }
});

