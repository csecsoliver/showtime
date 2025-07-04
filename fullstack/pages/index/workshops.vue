<script setup lang="ts">
import type { InviteBasic, InviteDetails } from "~/server/types/types";
const authState = ref(
  (await $fetch("/api/auth")) as {
    auth: boolean;
    email: string;
  }
);
const invites = ref({
  basicInvites: [] as Array<InviteBasic>,
  detailedInvites: [] as Array<InviteDetails>,
});
async function init() {
  invites.value = (await $fetch("/api/invites")) as {
    basicInvites: Array<InviteBasic>;
    detailedInvites: Array<InviteDetails>;
  };
  console.log(
    `Found ${invites.value.basicInvites.length} open invites and ${Object.keys(invites.value.detailedInvites[0])} detailed invites for user ${authState.value.email}`
  );
}
init();
</script>
<template>
  <div>
    <div v-if="authState?.auth">
      <AuthState />
      <div>
        <h2>Releváns foglalkozások (amelyekben résztvevőként van jelen)</h2>
        <ul>
          <li v-for="invite in invites.detailedInvites" :key="invite.id">
            {{
              new Date(invite.workshop.time).toLocaleDateString("hu-HU", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })
            }}
            időpontban - {{ invite.workshop.town }} településen -
            {{ invite.teacher.name ?? invite.teacher.email }} által szervezett
            foglalkozás: <a :href="`/invite/${invite.id}`">Részletek</a>
          </li>
        </ul>
      </div>
      <div>
        <h2>Nyílt foglalkozások</h2>
        <ul>
          <li v-for="invite in invites.basicInvites" :key="invite.id">
            {{
              new Date(invite.date).toLocaleDateString("hu-HU", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }}
            - {{ invite.invitor }} által szervezett foglalkozás:
            <a :href="`/invite/${invite.id}`">Részletek</a>
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      <VerifyEmail />
    </div>
  </div>
</template>
