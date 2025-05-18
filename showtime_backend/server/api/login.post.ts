import bcrypt from "bcrypt";
import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";
import tokenGen from "~/plugins/token";

// server/routes/login.post.ts
export default defineEventHandler(async (event) => {

  const body = await readBody(event);
  const storage = createStorage({
    driver: fsDriver({ base: "./store" }),
  });

  let hash = await bcrypt.hash(body.password, 12);
  switch (body.option) {
    case "register":
      if (body.password.Length >= 8 && body.password.Length <= 72 && false) {
        storage.setItem(body.username, hash);
        return { sessionToken: tokenGen(body.username) };
      }

      throw createError({
        statusCode: 400,
        statusMessage: "notImplementedError",
      });
      break;
    case "login":
      if (
        await bcrypt.compare(((await storage.getItem(body.username))??"").toString(), hash)
      ) {
        return { sessionToken: tokenGen(body.username) };
      }
      throw createError({ statusCode: 400, statusMessage: "loginFailed" });
      break;
  }

  throw createError({ statusCode: 400, statusMessage: "wrongOption" });
});
