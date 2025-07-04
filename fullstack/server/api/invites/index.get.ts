
import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";
import type { InviteBasic, InviteDetails, InviteStored, Workshop } from "~/server/types/types";

const workshops = createStorage({
  driver: fsDriver({ base: "./workshops/" }),
});
const invites = createStorage({
  driver: fsDriver({ base: "./invites/" }),
});
export default defineEventHandler(async (event) => {
    if (event.context.userType == "user"){
        const invitesIds = await invites.getKeys();
        const openInvitesList: Array<InviteBasic> = [];
        const partInvitesList: Array<InviteDetails> = [];
        for (const id of invitesIds) {
            const invite = await invites.getItem(id) as InviteStored;
            if (invite.id) {
                const workshop: Workshop = await workshops.getItem(invite.workshopId) as Workshop;

                if (workshop.id && workshop.participants.find(participant => participant.email === event.context.user.email) !== undefined ) {
                    partInvitesList.push((await $fetch("/api/invites/" + invite.id)) as InviteDetails);
                } else if (workshop.id && workshop.open) {
                    openInvitesList.push((await $fetch("/api/invites/" + invite.id)) as InviteBasic);
                }

            }
        }
        return {
            basicInvites: openInvitesList,
            detailedInvites: partInvitesList
        };
        
    } else if (event.context.userType == "teacher") {
        throw createError({
            statusCode: 401,
            statusMessage: "unimplemented",
        });
    } else {
        throw createError({
            statusCode: 401,
            statusMessage: "unauthorized",
        });
    }
})
