<script setup lang="ts">
import { ref } from "vue";
import type { Workshop } from "~~/server/types/types";
import ViewWorkshop from "~/components/ViewWorkshop.vue";
const toast = useToast();
const workshops: Ref<Workshop[]> = ref([]);
async function refresh() {
  try {
    const response = await $fetch("/api/workshops", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = response;
    workshops.value = data;
  } catch {
    toast.add({
      title:
        "Hiba történt a foglalkozások betöltése során, jelentsd a fejlesztőknek.",
      color: "error",
    });
  }
}
refresh();
</script>
<template>
  <main class="flex flex-wrap justify-center items-center mt-4">
    <table class="table-auto w-9/10">
      <thead>
        <tr>
          <th colspan="4"><h2 @click="refresh()">Foglalkozások</h2></th>
        </tr>
        <tr>
          <th style="width: 30%">Időpont</th>
          <th style="width: 20%">Helyszín</th>
          <th style="width: 10%">Létszám</th>
          <th style="width: 40%">Műveletek</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in workshops" :key="i.id">
          <td>{{ i.time.toString() }}</td>
          <td>{{ i.town }}</td>
          <td>{{ i.participants.length }}</td>
          <td>
            <ViewWorkshop :id="i.id" />
            <DeleteWorkshop :id="i.id" />
          </td>
        </tr>
      </tbody>
    </table>
  </main>
</template>
<style scoped>
th,
td {
  border: 1px solid var(--sht-text);
  box-sizing: border-box;
}
table {
  border-collapse: collapse;
}
th {
  background-color: var(--sht-pink);
  font-weight: bold;
}
</style>
