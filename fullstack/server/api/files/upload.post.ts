import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";
const docup = createStorage({
  driver: fsDriver({ base: "./docup" }),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body || !body.file || !body.name) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid request body",
    });
  }
  const buffer = Buffer.from(body.file, "base64");
  await docup.setItem(body.name, buffer);
  await docup.setMeta(body.name, { mimeType: body.type || "application/octet-stream" });
  return { message: "File uploaded successfully", fileName: body.name };
});