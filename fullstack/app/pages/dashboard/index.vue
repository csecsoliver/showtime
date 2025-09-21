<script setup lang="ts">
import { ref } from "vue";
import type { Workshop } from "~~/server/types/types";
const toast = useToast();
const workshops: globalThis.Ref<Workshop[]> = ref([]);
async function refresh() {
  try {
    const response = await $fetch("/api/workshops", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    workshops.value = response as Workshop[];
  } catch {
    toast.add({
      title: "Hiba történt a foglalkozások betöltése során, jelentsd a fejlesztőknek.",
      color: "error",
    });
  }
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
      <CreateWorkshop />
      <CreateInvite />
    </div>
  </main>
</template>

<style scoped>
main > div {
  width: 30rem;
  padding: 0.2rem 0.5rem;
  margin: 0.5rem;
  border: 1px solid var(--sht-text);
  border-radius: 10px;
  height: fit-content;
}

button {
  margin: 0.5rem;
}
</style>
