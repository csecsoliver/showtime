<script setup lang="ts">
import type { InviteBasic, Workshop } from '~/server/types/types';

const route = useRoute();
let date: Date = new Date();
let invitor: string = "";
let workshop: Workshop = {
  id: route.params.id as string,
  town: "",
  time: "",
  location: "",
  open: false,
  participants: [],
  teachers: [],
}
let sent = false;
const email = ref("");
const code = ref("");


async function init() {
  const response: InviteBasic = await $fetch(`/api/invite/${route.params.id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  invitor = response.invitor;
  date = new Date(response.date);
}
async function mail() {
  sent = true;
}
async function verify() {

}
init();
</script>
<template>
 <div>
   <h2>{{ invitor }} meghívta a {{ date.toLocaleDateString("hu-HU", {
  year: "numeric",
  month: "long",
  day: "numeric",
}) }} dátumú Ciklus-show foglalkozásra</h2>
   <p>Részletes adatok megtekintéséhez kérjük erősítse meg email címét.</p>
   <form>
      <label for="email">Email cím:</label>
      <input id="email" v-model="email" type="email" name="email" required>
      <button type="submit" @click="mail">Kód küldése</button>
      <label for="code">Megerősítő kód:</label>
      <input id="code" v-model="code" type="text" name="code" :required ="sent">
      <button type="submit" @click="verify">Ellenőrzés</button>
   </form>
 </div>
</template>