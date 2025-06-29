<script setup lang="ts">
import type { InviteBasic, Workshop } from "~/server/types/types";

import * as z from "zod";
const route = useRoute();
if (route.params.id.length < 1) {
  navigateTo("/");
}
const date: Ref = ref(new Date());
const invitor: Ref = ref();
let workshop: Workshop = {
  id: route.params.id as string,
  town: "",
  time: "",
  location: "",
  open: false,
  participants: [],
  teachers: [],
};
const sent = ref(false);
const sent = ref(false);
const state = ref({
  email: "",
  code: "",
});
const schema = z.object({
  email: z.string().email(),
  code: z.string().optional(),
});
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
  sent.value = true;
  
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
    <UForm :schema="schema" :state="state" class="flex flex-col gap-4" :v-if="!done" >
      <UFormField label="Email" name="email">
        <UInput v-model="state.email" placeholder="Add meg az email címed" :disabled="sent"/>
      </UFormField>
      <UButton :disabled="sent" @click="mail"> Email küldése </UButton>
      <UFormField label="Megerősítő köd" name="code">
        <UInput
          v-model="state.code"
          placeholder="Add meg az emailben kapott kódot"
          :disabled="!sent"
        />
      </UFormField>
      <UButton :disabled="!sent" @click="verify"> Megerősítés </UButton>
    </UForm>
  </div>
</template>
