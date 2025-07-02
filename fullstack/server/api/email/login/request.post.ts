import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";
import codes from "~/server/plugins/codes";
import transporter from "~/server/plugins/email";
import type { InviteStored } from "~/server/types/types";
const invites = createStorage({
  driver: fsDriver({ base: "./invites" }),
});
const users = createStorage({
  driver: fsDriver({ base: "./users" }),
});
export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as string;
  if (!body || body.length === 0) {
    sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Invalid request body, you need an email address",
      })
    );
    return;
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
  const invite = (await invites.getItem(
    getRouterParam(event, "id") as string
  )) as InviteStored;
  if (!invite) {
    sendError(
      event,
      createError({
        statusCode: 404,
        statusMessage: "Invite not found",
      })
    );
  }
  if (!(await users.hasItem(body))) {
    users.setItem(body, {
      email: body,
      workshops: [invite.workshopId],
    });
  }
  const token = codes("gen", body);
  console.log(
    await transporter().sendMail({
      from: "showtime.coe@gmail.com",
      to: body,
      subject: `Megerősítő kód - ${token}`,
      text: `A megerősítő kódod: ${token}`,
    })
  );
});
