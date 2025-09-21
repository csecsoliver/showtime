import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";
import codes from "~~/server/plugins/codes";
import transporter from "~~/server/plugins/email";
const users = createStorage({
  driver: fsDriver({ base: "./users" }),
});
export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as { email: string };
  if (!body || !body.email || body.email.length === 0) {
    sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Invalid request body, you need an email address",
      })
    );
    return;
  }

  
  
  const email = body.email as string;
  if (!(await users.hasItem(email))) {
    users.setItem(email, {
      email: email,
      workshops: [],
    });
  }
  const token = codes("gen", email);
  console.log(
    await transporter().sendMail({
      from: "showtime.coe@gmail.com",
      to: email,
      subject: `Megerősítő kód - ${token}`,
      text: `A megerősítő kódod: ${token}`,
    })
  );
});
