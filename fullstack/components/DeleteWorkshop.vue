<template>
  <div>
    <button class="button" @click="deleteWorkshop">
      Lemondás
    </button>
  </div>
</template>

<script lang="ts" setup>
const toast = useToast();
const props = defineProps<{
  id: string;
}>();
async function deleteWorkshop() {
  try {
    if (!window.confirm("Biztosan le szeretnéd mondani a foglalkozást? Ez a művelet visszavonhatatlan!")) {
      return;
    }
    const workshopId = props.id;
    console.log("Deleting workshop with ID:", workshopId);
    await $fetch("/api/cancel_workshop", {
      method: "POST",
      body: { id: workshopId },
      headers: {
        "Content-Type": "application/json",
      },
    });
    toast.add({
      title: "Foglalkozás sikeresen lemondva.",
      color: "success",
    });
    navigateTo("/dashboard/sessions");
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