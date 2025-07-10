<template>
  <span>
    <a href="#" @click.prevent="cancelParticipation">Lemondás</a>
  </span>
</template>

<script lang="ts" setup>
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
    toast.add({
      title: "Hiba történt a foglalkozás lemondása során: " + error,
      color: "error",
    });
  }
}
</script>

<style>

</style>