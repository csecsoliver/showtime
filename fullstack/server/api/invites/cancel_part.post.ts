import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";
import provideEmailTransporter from "~/server/plugins/email";
import { Workshop } from "~/server/types/types";
const workshops = createStorage({
  driver: fsDriver({ base: "./workshops" }),
});

export default defineEventHandler(async (event) => {
  if (event.context.userType !== "user") {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "You must be logged in to cancel participation.",
    });
  }

  const body = await readBody(event) as { id: string; name: string; };

  const workshop = await workshops.getItem(body.id) as Workshop;
  if (!workshop) {
    throw createError({
      statusCode: 404,
      statusMessage: "WorkshopNotFound",
    });
  }

  let participants = workshop.participants || [];
  if (!workshop.participants) {
    participants = [];
  }
  if (!participants.find((p) => p.name === body.name)) {
    throw createError({
      statusCode: 404,
      statusMessage: "ParticipantNotFound",
    });
  }
  participants = participants.filter((p) => p.name !== body.name);

  await workshops.setItem(body.id, {
    ...workshop,
    participants: participants,
  });
  await provideEmailTransporter().sendMail({
    from: "showtime.coe@gmail.com",
    to: workshop.teachers[0],
    subject: `Foglalkozás lemondva - ${body.name}`,
    text: `${event.context.user.email} lemondta ${body.name} részvételét.`,
  });

  return { message: "Participation cancelled successfully." };
});


