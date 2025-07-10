import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";
import type { Teacher } from "../types/types";

import bcrypt from "bcrypt";
import userManipulate from "../plugins/users";
const teachers = createStorage({
  driver: fsDriver({ base: "./teachers" }),
});
export default defineEventHandler(async (event) => {
  const body = await readBody(event) as { function: string; value: string | { old: string; new: string; confirm: string; }; };

  if (event.context.userType !== "teacher") {
    throw createError({
      statusCode: 401,
      statusMessage: "unauthorized",
      message: "You must be logged in to update settings.",
    });
  }
  if (!body || !body.function || !body.value) {
    throw createError({
      statusCode: 400,
      statusMessage: "badRequest",
    });
  }

  if (body.function === "fullName") {
    const old = await teachers.getItem(event.context.user.email) as Teacher;
    if (!old || !(typeof body.value === "string")) {
      throw createError({
        statusCode: 404,
        statusMessage: "userNotFound",
      });
    }
    old.name = body.value as string;
    await teachers.setItem(event.context.user.email, old);
  } else if (body.function === "password") {
    const old = await teachers.getItem(event.context.user.email) as Teacher;
    if (!old || !(typeof body.value === "object" && "old" in body.value && "new" in body.value && "confirm" in body.value)) {
      throw createError({
        statusCode: 404,
        statusMessage: "userNotFound",
      });
    }
    if ((await userManipulate("checkpass", event.context.user.email, (body.value as { old: string; new: string; confirm: string; }).old))) {
      if ((body.value as { old: string; new: string; confirm: string; }).new !== (body.value as { old: string; new: string; confirm: string; }).confirm) {
        throw createError({
          statusCode: 400,
          statusMessage: "passwordMismatch",
        });
      } else {
        if (body.value.new.length < 8 || body.value.new.length > 72) {
          throw createError({
            statusCode: 400,
            statusMessage: "passwordError",
          });
          return;
        }
        const hash = await bcrypt.hash(body.value.new, 12);
        teachers.setItem(event.context.user.email, {
          ...old,
          password: hash,
        });
      }
    }

  } else {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: `Unknown function ${body.function}`,
    });
  }
})
