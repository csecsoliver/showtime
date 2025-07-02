<script setup lang="ts">
import type { InviteBasic, InviteDetails, Teacher, Workshop } from "~/server/types/types";

const route = useRoute();
if (route.params.id.length < 1) {
  navigateTo("/");
}
const date: Ref = ref(new Date());
const invitor: Ref = ref();
const workshop: Ref<Workshop> = ref({
  id: "",
  town: "",
  time: "",
  location: "",
  open: false,
  participants: [],
  teachers: [],
});
const teacher: Ref<Teacher> = ref({
  // user type for teachers
  email: "",
  workshops: []
})
const authState = ref(false);
async function init() {
  const response: InviteBasic | InviteDetails = await $fetch(
    `/api/invites/${route.params.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if ("invitor" in response) {
    invitor.value = response.invitor;
    console.log(invitor);
    date.value = new Date(response.date);
    authState.value = false;
    console.log("unathenticated")
  } else if ("teacher" in response && "workshop" in response && "email" in response) {
    invitor.value = response.teacher.name ?? response.teacher.email;
    date.value = new Date(response.workshop.time);
    authState.value = true;
    workshop.value = response.workshop;
    teacher.value = response.teacher;
    console.log("athenticated")
  }
}

init();
</script>
<template>
  <div>
    <div v-if="!authState.valueOf()">
      <h2>
        {{ invitor }} meghívta a
        {{
          date.toLocaleDateString("hu-HU", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        }}
        dátumú Ciklus-show foglalkozásra
      </h2>
      <VerifyEmail/>
    </div>
    <div v-if="authState.valueOf()">
      <h2>
        {{ invitor }} meghívta a
        {{
          date.toLocaleDateString("hu-HU", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric"
          })
        }}
        idópontban tartandó Ciklus-show foglalkozásra. 
      </h2>
      <ul>
        <li>Foglalkozásvezető elérhetősége: {{ teacher.email }}</li>
        <li>Foglalkozás helyszíne: {{ workshop.location??"Határozatlan" }}</li>
        <li><span v-if="workshop.open">Nyílt foglalkozás</span><span v-else>Zártkörű foglalkozás</span></li>
        <li>Résztvevők száma: {{ workshop.participants.filter(part => part.confirmed).length }}</li>
        
      </ul>
      
      
    </div>
  </div>
  
</template>
