import fsDriver from "unstorage/drivers/fs";
import { createStorage } from "unstorage";
const invites = createStorage({
  driver: fsDriver({ base: "./workshops/" }),
});
export default defineEventHandler(async (event) => {
  if (!getRouterParam(event, "param")) {
    sendError(event, createError({
      statusCode: 404,
      statusMessage: "Missing parameter",
    }));
  }
  const param: string  = getRouterParam(event, "param") as string;
  const invite = invites.getItem(param);
  return invite.then((data) => {
    if (!data) {
      throw createError({
        statusCode: 404,
        statusMessage: "Invite not found",
      });
    }
    return data;
  });
  

})
