import token from "../plugins/token";
import verification from "../plugins/verification";
import type { SecureSessionData, SessionData } from "../types/types";

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  if (event.method === "OPTIONS") {
    event.node.res.statusCode = 204;
    event.node.res.end();
  }
  const session = await getUserSession(event);
  const secureSession = session.secure as SecureSessionData | undefined;
  const userData = session.user as SessionData;
  if (session.secure && token("check", secureSession!.apiToken)) {
    event.context.userType = "teacher";
    event.context.user = {
      email: userData.name,
    }
  } else if (session.secure && verification("check", secureSession!.apiToken)) {
    event.context.userType = "user";
    event.context.user = {
      email: userData.name,
    }
  } else {
    event.context.userType = "guest";
    clearUserSession(event);
  }
});
