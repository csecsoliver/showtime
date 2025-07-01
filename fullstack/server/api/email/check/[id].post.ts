import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";
import transporter from "~/server/plugins/email";
import type { InviteStored, SessionData } from "~/server/types/types";
const invites = createStorage({
  driver: fsDriver({ base: "./invites" }),
});
export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as string;
  if (!body || body.length === 0) {
    sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Invalid request body",
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

  console.log(
    await transporter().sendMail({
      from: "showtime.coe@gmail.com",
      to: "",
      subject: `Megerősítő kód`,
      text: ``,
    })
  );
});
