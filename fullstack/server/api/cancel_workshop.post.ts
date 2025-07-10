import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";
import type { Teacher, Workshop } from "../types/types";
import provideEmailTransporter from "../plugins/email";
const workshops = createStorage({
  driver: fsDriver({ base: "./workshops" }),
});
const teachers = createStorage({
  driver: fsDriver({ base: "./teachers" }),
});

export default defineEventHandler(async (event) => {
  if (event.context.userType !== "teacher") {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "You must be logged in to cancel a workshop.",
    });
  }
  const body = await readBody(event) as { id: string; };

  console.log(`Cancelling workshop with ID: ${Object.keys(body)}`);
  const workshop = await workshops.getItem(body.id) as Workshop;
  if (!workshop) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found",
      message: "Workshop not found.",
    });
  }
  const mail = provideEmailTransporter();
  const done: string[] = [];
  for (const part of workshop.participants) {
    if (done.includes(part.email)) continue;
    done.push(part.email);
    await mail.sendMail({
      to: part.email,
      subject: "Foglalkozás törölve",
      text: `Sajnálattal közöljük, hogy a ${new Date(workshop.time).toLocaleString()} időpontban, ${workshop.town} településen tartandó foglalkozás törlésre került. Megértésüket köszönjük.`,
    });

  }
  await teachers.setItem(event.context.user.email, {
    ...(await teachers.getItem(event.context.user.email)) as Teacher, 
    workshops: (await teachers.getItem(event.context.user.email) as Teacher)?.workshops.filter((id: string) => id !== body.id) || [],
  });
  await workshops.removeItem(body.id);

  return { message: "Workshop cancelled successfully" };
})
