<script lang="ts" setup>
import { ref } from "vue";
import z from "zod";
import type { Participant, Workshop } from "~/server/types/types";
const toast = useToast();

const props = defineProps<{
  id: string;
}>();

const state = ref({
  town: "",
  time: Date.now().toString(),
  open: false,
  location: "",
  participants: [] as Participant[]
});
const schema = z.object({
  town: z.string().min(2).max(100),
  time: z.string().datetime(),
  open: z.boolean(),
  location: z.string().max(200).optional(),
  participants: z.array(z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
  })),
});
const workshopid = ref('');
async function refresh() {
  const response = await $fetch("/api/workshops", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = response;
  const workshop = data.find((w: Workshop) => w.id == props.id);
  if (!workshop) {
    toast.add({
      title: "Workshop not found",
      color: "error",
    });
    return;
  }
  workshopid.value = workshop.id;
  state.value.town = workshop.town;
  state.value.time = workshop.time;
  state.value.location = workshop.location ?? "";
  state.value.open = workshop.open;
  state.value.participants = workshop.participants || [];
  console.log("Workshop data for editing:", state.value);
}

async function submitWorkshop() {
  const workshop = {
    id: workshopid.value,
    town: state.value.town,
    time: state.value.time,
    location: state.value.location,
    open: state.value.open,
    participants: state.value.participants,
  };
  console.log("Submitting workshop data:", workshop);

  try {
    console.log("Submitting workshop data:", workshop);
    await $fetch("/api/edit_workshop", {
      method: "POST",
      body: workshop,
      headers: {
        "Content-Type": "application/json",
      },
    });
    // location.reload();
  } catch (error) {
    toast.add({
      title: (error as Error).message,
      color: "error",
    });
  }
}
async function removeParticipant(email: string) {
  if (window.confirm("Biztosan eltávolítod a résztvevőt?")) {

    state.value.participants = state.value.participants.filter(
      (p) => p.email !== email
    );
  }
}
refresh();
</script>
<template>
  <UModal title="Foglalkozás részletei" size="sm">
    <button class="button">Részletek</button>

    <template #body>
      <UForm :schema="schema" :state="state" class="flex flex-col gap-4">
        <UFormField>
          <UInput v-model="state.town" label="Város" name="town" required />
        </UFormField>
        <UFormField>
          <UInput v-model="state.location" label="Helyszín" name="location" @click="console.log(state.open)"/>
        </UFormField>
        <UFormField>
          <UInput
            v-model="state.time"
            label="Dátum"
            name="date"
            type="datetime-local"
            required
          />
        </UFormField>
        <UFormField>
          <UCheckbox
            v-model="state.open"
            label="Nyílt foglalkozás"
            name="open"
            
          />
        </UFormField>
        <ul>
          <li
            v-for="participant in state.participants"
            :key="participant.email"
          >
            {{ participant.name }} ({{ participant.email }})
            <UButton
              @click="
                removeParticipant(participant.email)
              "
              >Eltávolítás</UButton
            >
          </li>
        </ul>
        <UButton @click="submitWorkshop">Mentés</UButton>
      </UForm>
    </template>
  </UModal>
</template>
<style scoped></style>
