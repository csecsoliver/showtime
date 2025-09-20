<script setup lang="ts">
import { ref } from 'vue';
const town = ref('');
const date = ref('');
const open = ref(false);
async function submitWorkshop() {
  const form = document.querySelector('form');
  console.log(form);
  if (!form) return;

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    console.log('Submitting workshop data:', data);
    const response = await $fetch('/api/workshop', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Workshop created:', response);
    location.reload();
  } catch (error) {
    console.error('Error creating workshop:', error);
  }
}

</script>
<template>
  <UModal title="Új foglalkozás létrehozása" size="sm" >
    <button class="button"  >Létrehozás</button>

    <template #body>
        <form class="flex flex-col gap-4" @submit.prevent="submitWorkshop()">
            <label for="town">Város</label>
            <input id="town" v-model="town" class="" type="text" name="town" required>
            <label for="date">Dátum</label>
            <input id="date" v-model="date" type="datetime-local" name="date" required>
            <div>
              <label for="open" class="mr-4">Nyílt foglalkozás</label>
              <input id="open" v-model="open" type="checkbox" name="open">
            </div>
            <button type="submit" class="button">Létrehozás</button>
        </form>
    </template>
  </UModal>
</template>
<style scoped>


</style>