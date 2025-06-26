
import { createStorage } from "unstorage";
import type { SessionData } from "~/server/types/types";
const invites = createStorage({
  driver: fsDriver({base: "./invites"})
})
export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as string[];
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
  const invite = invites.getItem((getRouterParam(event, "id") as string));
  if (!invite) {
    sendError( event, createError({
      statusCode: 404,
      statusMessage: "Invite not found",
    }))
  }
  return "success sending emails to " + body +" as " + sessionData.name
});
