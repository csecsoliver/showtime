<template>
  <span>
    <a href="#" @click.prevent="cancelParticipation">Lemondás</a>
  </span>
</template>

<script lang="ts" setup>
import type { NuxtError } from "#app";

const props = defineProps<{
  id: string;
  name: string;
}>();
const toast = useToast();

async function cancelParticipation() {
  try {
    await $fetch("/api/invites/cancel_part", {
      method: "POST",
      body: { id: props.id, name: props.name },
      headers: {
        "Content-Type": "application/json",
      },
    });
    toast.add({
      title: "Foglalkozás sikeresen lemondva.",
      color: "success",
    });
  } catch (error) {
    switch ((error as NuxtError).statusMessage) {
      case "Unauthorized":
        toast.add({
          title: "Nincs jogosultsága, töltse be újra az oldalt",
          color: "error",
        });
        break;
      case "WorkshopNotFound":
        toast.add({
          title: "A foglalkozás nem található",
          color: "error",
        });
        break;
      case "ParticipantNotFound":
        toast.add({
          title: "Nem találja a résztvevőt",
          color: "error",
        });
        break;
      default:
        toast.add({
          title: "Hiba történt a foglalkozás lemondása során",
          color: "error",
        });
    }
  }
}
</script>

<style>

</style>