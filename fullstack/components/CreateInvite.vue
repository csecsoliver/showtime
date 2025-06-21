<script setup lang="ts">
import { forEachLeadingCommentRange } from "typescript";
import { ref } from "vue";
import * as z from "zod";
import type { Workshop } from "~/server/types/types";
const open = ref(false);
const state = ref({
  workshopText: "",
  sendEmails: false,
});
let response: Workshop[] = [];
const schema = z.object({
  workshopText: z.string(),
  sendEmails: z.boolean().optional(),
});
const items: Ref<string[]> = ref([]);
async function submitInvite() {
  const data = {
    workshopId: state.value.workshopText.split("(")[1].split(")")[0], // the workshoop id is between the parentheses
  };
  try {
    const response = await $fetch("/api/invite/create", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Invite created:", response);
  } catch (error) {
    console.error("Error creating invite:", error);
  }
}
async function fetchWorkshops() {
  try {
    response = await $fetch("/api/workshops", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
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
        

        <UFormField label="Workshop" name="workshop">
          <UInputMenu v-model="state.workshopText" :items="items" placeholder="Válassz foglalkozást"/>
        </UFormField>
        <UFormField label="Send Emails" name="sendEmails">
          <UCheckbox v-model="state.sendEmails"/>
        </UFormField>
        
        <UButton type="submit"> Submit </UButton>
      </UForm>
    </template>
  </UModal>
</template>
<style scoped></style>
