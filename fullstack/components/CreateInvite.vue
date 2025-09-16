<script setup lang="ts">
import { UFormField } from "#components";
import { ref } from "vue";
import * as z from "zod";
import type { InviteStored, Workshop } from "~/server/types/types";

const state = ref({
  workshopText: "",
  sendEmails: false,
  emails: "",
  custom: {text: "", public: false}
});
let inviteId: string | null = null; // This will hold the invite ID after creation
let response: Workshop[] = [];
const schema = z.object({
  workshopText: z.string(),
  sendEmails: z.boolean().optional(),
  emails: z.string().optional(),
  customtext: z.string().optional(),
  custompub: z.boolean().optional(),
});
const items: Ref<string[]> = ref([]);
async function submitInvite() {
  const data = {
    workshopId: state.value.workshopText.split("(")[1].split(")")[0], // the workshoop id is between the parentheses
  };
  try {
    const response = await $fetch("/api/invites/create", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }) as InviteStored;
    console.log("Invite created:", response);
    inviteId = response.id
    if (state.value.sendEmails) {
      await sendInvites()
    }
    location.reload();
  } catch (error) {
    console.error("Error creating invite:", error);
  }
}
async function sendInvites() {

  const emails = state.value.emails.split(",").map((email) => email.trim()).filter((email) => email.length > 0);
  if (emails.length == 0){
    return;
  }
  try {
    const response = await $fetch(`/api/email/invite/${inviteId}`, {
      method: "POST",
      body: emails,
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Invites sent:", response);
  } catch (error) {
    console.error("Error sending invites:", error);
  }
}
async function fetchWorkshops() {
  try {
    response = await $fetch<Workshop[]>("/api/workshops", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }) as Workshop[];
    items.value = response.map((workshop: Workshop) => workshop.town + " - " + workshop.time + " (" + workshop.id + ")");
  } catch (error) {
    console.error("Error fetching workshops:", error);
  }
}
fetchWorkshops();
</script>
<template>
  <UModal title="Új meghívó létrehozása" size="sm">
    <button class="button">Meghívó</button>

    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="flex flex-col gap-4"
        @submit="submitInvite"
      >
        

        <UFormField label="Foglalkozás" name="workshop">
          <USelectMenu v-model="state.workshopText" :items="items" placeholder="Válassz foglalkozást"/>
        </UFormField>
        <UFormField label="Email küldése" name="sendEmails">
          <UCheckbox v-model="state.sendEmails"/>
        </UFormField>
        <UFormField label="Email címek" name="emails">
          <UInput
            v-model="state.emails"
            type="text"
            placeholder= "Példa: email@example.com, email2@example.com"
          />
        </UFormField>
        <UFormField label="Egyedi meghívószöveg" name="customtext">
          <UInput
            v-model="state.custom.text"
            type="text"
            placeholder="Ez fog megjelenni a megívottak számára"
          />
        </UFormField>
        <UFormField label="Egyedi meghívószöveg publikus?" name="custompub">
          <UCheckbox v-model="state.custom.public"/>
        </UFormField>
        <UButton type="submit"  class="button"> Submit </UButton>
      </UForm>
    </template>
  </UModal>
</template>
<style scoped></style>
