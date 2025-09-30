import bcrypt from "bcrypt";
import token from "../plugins/token";
import userManipulate from "../plugins/users";

// server/routes/login.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  switch (body.option) {
    case "register":
      
      

      if (typeof body.password === "string" && body.password.length >= 8 && body.password.length <= 72 && typeof body.username === "string" && body.username?.length >= 3 && body.username?.length <= 32) {
        const hash = await bcrypt.hash(body.password, 12);
        
        if (!(await userManipulate("getpass", body.username))) {
          await userManipulate("makeuser", body.username, hash);
          await replaceUserSession(event, {
            user: {
              name: body.username,
            },
            secure: {
              apiToken: token("gen", body.username),
            },
          });
          return { apiToken: token("gen", body.username) };
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
      if (await userManipulate("checkpass", body.username, body.password)) {
        await replaceUserSession(event, {
          user: {
            name: body.username,
          },
          secure: {
            apiToken: token("gen", body.username),
          },
        });
        return { apiToken: token("gen", body.username) };
      }
      throw createError({ statusCode: 401, statusMessage: "loginFailed" });
      break;
  }

  throw createError({ statusCode: 400, statusMessage: "wrongOption" });
});
