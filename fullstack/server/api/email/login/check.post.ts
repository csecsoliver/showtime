import codes from "~/server/plugins/codes";
import verification from "~/server/plugins/verification";
import type { SecureSessionData, SessionData } from "~/server/types/types";
export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as {token: string, email: string};
  if (typeof body !== "object" || !body || !body.email || !body.token) {
    sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Invalid request body, you need \"email\", \"token\"",
      })
    );
    return;
  }
  
  if (codes("check", body.token) === body.email) {
    await replaceUserSession(event, {
      user: {
        name: body.email,
      } as SessionData,
      secure: {
        apiToken: verification("gen", body.email),
      } as SecureSessionData,
    });
    return;
  } else {
    sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Invalid token",
      })
    );
    return;
  }

  
});
