import bcrypt from "bcrypt";
import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";
import tokenGen from "~/plugins/token";
import userManipulate from "~/plugins/users";

// server/routes/login.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  

  let hash = await bcrypt.hash(body.password, 12);
  switch (body.option) {
    case "register":
      if (body.password.Length >= 8 && body.password.Length <= 72) {
        if (!(await userManipulate("getpass", body.username))) {
          await userManipulate("setpass", body.username, hash);

          return { sessionToken: tokenGen(body.username) };
        } else {
          throw createError({
            statusCode: 400,
            statusMessage: "userExistsError",
          });
        }
      } else {
        throw createError({
          statusCode: 400,
          statusMessage: "passwordError",
        });
      }
      break;
    case "login":
      if (await userManipulate("checkpass", body.username, hash)) {
        return { sessionToken: tokenGen(body.username) };
      }
      throw createError({ statusCode: 401, statusMessage: "loginFailed" });
      break;
  }

  throw createError({ statusCode: 400, statusMessage: "wrongOption" });
});
