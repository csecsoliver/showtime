<script setup lang="ts">
import type {
  InviteBasic,
  InviteDetails,
  Participant,
  SessionData,
  Teacher,
  Workshop,
} from "~/server/types/types";
const toast = useToast();
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
  workshops: [],
});
const user = ref((useUserSession().user.value as SessionData)?.name);
const authState = ref(false);
const name = ref("");
const exists = ref(true);
async function init() {
  try {
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
      console.log("unathenticated");
    } else if (
      "teacher" in response &&
      "workshop" in response &&
      "email" in response
    ) {
      invitor.value = response.teacher.name ?? response.teacher.email;
      date.value = new Date(response.workshop.time);
      authState.value = true;
      workshop.value = response.workshop;
      teacher.value = response.teacher;
      user.value = (useUserSession().user.value as SessionData).name;

      console.log("athenticated");
    }
  } catch (error) {
    exists.value = false;
    toast.add({
      title: `Hiba történt a meghívó betöltése során: ${error}`,
      color: "error",
    });
  }
}
async function confirmParticipation() {
  const response: Participant = await $fetch(
    `/api/invites/confirm/${route.params.id}`,
    {
      method: "POST",
      body: {
        email: user.value,
        name: name.value,
      },
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  workshop.value.participants.push(response);
  console.log("confirmed participation", response);
}

init();
</script>
<template>
  <div v-if="exists">
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
      <VerifyEmail />
    </div>
    <div v-if="authState.valueOf()">
      <AuthState />
      <h2 class="font-bold">
        {{ invitor }} meghívta a
        {{
          date.toLocaleDateString("hu-HU", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })
        }}
        időpontban tartandó Ciklus-show foglalkozásra.
      </h2>
      <ul>
        <li>Foglalkozásvezető elérhetősége: {{ teacher.email }}</li>
        <li>
          Foglalkozás helyszíne: {{ workshop.location ?? "Határozatlan" }}
          {{ workshop.town }}
        </li>
        <li>
          <span v-if="workshop.open">Nyílt foglalkozás</span
          ><span v-else>Zártkörű foglalkozás</span>
        </li>
        <li>
          Megerősített résztvevők száma:
          {{ workshop.participants.filter((part) => part.confirmed).length }}
        </li>
        <li>
          Ön által megerősített résztvevők:
          <span
            v-for="part in workshop.participants.filter(
              (part) => part.email === user && part.confirmed
            )"
            :key="part.name"
          >
            {{ part.name }}: <CancelPrticipation
            :id="workshop.id"
            :name="part.name"
            />,
          </span>
        </li>
      </ul>

      <UFormField class="my-3" label="Részvétel megerősítése" name="code">
        <UInput v-model="name" placeholder="Részvevő neve" />

        <UButton class="button" @click="confirmParticipation">
          Megerősítés
        </UButton>
      </UFormField>
    </div>
    <div></div>
  </div>
</template>
