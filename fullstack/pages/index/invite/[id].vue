<script setup lang="ts">
import type { InviteBasic, Workshop } from "~/server/types/types";

const route = useRoute();
if (route.params.id.length < 1) {
  navigateTo("/");
}
let date: Ref = ref(new Date());
let invitor: Ref = ref();
let workshop: Workshop = {
  id: route.params.id as string,
  town: "",
  time: "",
  location: "",
  open: false,
  participants: [],
  teachers: [],
};
let sent = false;
const email = ref("");
const code = ref("");
const state = 

async function init() {
  const response: InviteBasic = await $fetch(
    `/api/invites/${route.params.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  invitor.value = response.invitor;
  console.log(invitor);
  date.value = new Date(response.date);
}
async function mail() {
  sent = true;
}
async function verify() {}
init();
</script>
<template>
  <div>
    <h2>
      {{ invitor }} meghívta a
      {{
        date.toLocaleDateString("hu-HU", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      }}
      dátumú Ciklus-show foglalkozásra
    </h2>
    <p>Részletes adatok megtekintéséhez kérjük erősítse meg email címét.</p>
    <UForm
      :schema="schema"
      :state="state"
      class="flex flex-col gap-4"
      @submit="submitInvite"
    >
    </UForm>
  </div>
</template>
