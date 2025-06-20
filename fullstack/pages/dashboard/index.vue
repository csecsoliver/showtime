<script setup lang="ts">
import { ref } from 'vue';
import type { Workshop } from '~/server/types/types';
const workshops: globalThis.Ref<Workshop[]> = ref([]);
async function refresh() {
  const response = await $fetch('/api/workshops', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    
  });
  workshops.value = response as Workshop[];
}
refresh();

</script>
<template>
  <main class="flex flex-wrap justify-center items-center mt-4">
    <div>
      <h2>Következő foglalkozások</h2>
      <ul v-for="i in workshops" :key="i.id">
        <li>{{ i.town }} - {{ i.time }}</li>
        
      </ul>
    </div>
    <div>
      <h2>Gyorsműveletek</h2>
      <CreateWorkshop/>
      <button class="button" @click="refresh()">Meghívók</button>
    </div>


  </main>
</template>

<style scoped>

  main > div {
    width : 30rem;
    padding: 0.2rem 0.5rem;
    margin: 0.5rem;
    border: 1px solid var(--sht-text);
    border-radius: 10px;
    height: fit-content;
  }

  button{
    margin: 0.5rem;
  }
</style>
