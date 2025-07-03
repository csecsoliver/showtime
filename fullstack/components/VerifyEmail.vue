<template>
  <div>
    <UForm
      :schema="schema"
      :state="state"
      class="flex flex-col gap-4"
      :v-if="!done"
    >
      <p>Részletes adatok megtekintéséhez kérjük erősítse meg email címét.</p>
      <UFormField label="Email" name="email">
        <UInput
          v-model="state.email"
          placeholder="Add meg az email címed"
          :disabled="sent"
        />
        <UButton  class="button" :disabled="sent" @click="mail"> Email küldése </UButton>
      </UFormField>
      <UFormField label="Megerősítő köd" name="code">
        <UInput
          v-model="state.code"
          placeholder="Add meg az emailben kapott kódot"
          :disabled="!sent"
        />
        <UButton class="button" :disabled="!sent" @click="verify"> Megerősítés </UButton>
      </UFormField>
    </UForm>
  </div>
</template>

<script lang="ts" setup>
import * as z from "zod";
const sent = ref(false);
const done = ref(false);
const state = ref({
  email: "",
  code: "",
});
const toast = useToast();
const schema = z.object({
  email: z.string().email(),
  code: z.string().optional(),
});
async function mail() {
  try {
    await $fetch(`/api/email/login/request`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },
      body: {email: state.value.email},
    });
    sent.value = true;
  } catch (error) {
    toast.add({
      title: (error as Error).message,
      color: "error",
    });
  }
}
async function verify() {
  try {
    await $fetch(`/api/email/login/check`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },
      body: {email: state.value.email, token: state.value.code},
    });
    done.value = true;
    location.reload();
  } catch (error) {
    toast.add({
      title: (error as Error).message,
      color: "error",
    });
  }
}
</script>

<style></style>
