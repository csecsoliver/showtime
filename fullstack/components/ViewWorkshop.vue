<script lang="ts" setup>
import { ref } from "vue";
import type { Workshop } from "~/server/types/types";

const town = ref("");
const date = ref("");
const open = ref(false);
const location = ref("");
const props = defineProps<{
  id: string;
}>();

const state = ref({
  town: "",
  time: "",
  open: false,
  location: "",
  participants: [],
  
});
const workshop: Ref<Workshop> = ref({
  id: props.id,
  town: "",
  time: "",
  location: "",
  open: false,
  participants: [],
  teachers: [],
});
async function refresh() {
  const response = await $fetch("/api/workshops", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = response;
  workshop.value = data.find((w: Workshop) => w.id == props.id) || {
    id: props.id,
    town: "",
    time: "",
    location: "",
    open: false,
    participants: [],
    teachers: [],
  };
  town.value = workshop.value.town;
  location.value = workshop.value.location || "";
  date.value = new Date(workshop.value.time).toISOString().slice(0, 16);
  open.value = workshop.value.open;
  console.log("Workshop data:", workshop.value);
}

async function submitWorkshop() {
  const form = document.querySelector("form");
  console.log(form);
  if (!form) return;

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    console.log("Submitting workshop data:", data);
    const response = await $fetch("/api/edit_workshop", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Workshop edited:", response);
  } catch (error) {
    console.error("Error editing workshop:", error);
  }
}
refresh();
</script>
<template>
  <UModal title="Új foglalkozás létrehozása" size="sm">
    <button class="button">Részletek</button>

    <template #body>
      <form class="flex flex-col gap-4" @submit.prevent="submitWorkshop()">
        <label for="town">Város</label>
        <input
          id="town"
          v-model="town"
          class=""
          type="text"
          name="town"
          required
        >
        <label for="location">Helyszín</label>
        <input
          id="location"
          v-model="location"
          class=""
          type="text"
          name="location"
        >
        <label for="date">Dátum</label>
        <input
          id="date"
          v-model="date"
          type="datetime-local"
          name="date"
          required
        >
        <label for="participants">Résztvevők</label>
        <ul
          v-for="participant in workshop.participants"
          id="participants"
          :key="participant.email"
        >
          <li>{{ participant.name }} ({{ participant.email }})</li>
        </ul>

        <div>
          <label for="open" class="mr-4">Nyílt foglalkozás</label>
          <input id="open" v-model="open" type="checkbox" name="open" />
        </div>
        <button type="submit" class="button">Mentés</button>
      </form>
      <UForm :schema="schema" :state="state" class="flex flex-col gap-4">
        <UFormField>
          <UInput v-model="town" label="Város" name="town" required />
        </UFormField>
        <UFormField>
          <UInput v-model="location" label="Helyszín" name="location" />
        </UFormField>
        <UFormField>
          <UInput v-model="date" label="Dátum" name="date" type="datetime-local" required />
        </UFormField>
        <UFormField>
          <UCheckbox v-model="open" label="Nyílt foglalkozás" name="open" />
        </UFormField>

      </UForm>
    </template>
  </UModal>
</template>
<style scoped></style>
