<script setup lang="ts">
import { ref, reactive } from "vue";
const toast = useToast();
const state = reactive({ fullName: ref(""), password: reactive({ old: ref(""), new: ref(""), confirm: ref("") }) });




async function update(field: keyof typeof state) {
  try {
    await $fetch("/api/settings", {
      method: "POST",
      body: { function: field, value: state[field] },
      headers: {
        "Content-Type": "application/json",
      },
    });
    toast.add({
      title: "Sikeres mentés",
      color: "success",
    });
  } catch (error) {
    toast.add({
      title: "Hiba történt a mentés során: " + error,
      color: "error",
    });
  }
}
</script>
<template>
  <main class="flex flex-wrap justify-center items-center mt-4">
    
    
    <div>
      <h2>Teljes Név</h2>
      <UForm state="state.fullName" @submit="update('fullName')">
        <UFormField>
          <UInput v-model="state.fullName" placeholder="Teljes Név" name="fullName" type="text" required />
        </UFormField>
        <UButton type="submit" class="button">Mentés</UButton>
      </UForm>
    </div>
    <div>
      <h2>Jelszó</h2>
      <UForm state="state.password" @submit="update('password')">
        <UFormField>
          <UInput v-model="state.password.old" placeholder="Korábbi jelszó" name="password" type="password" required />
        </UFormField>
        <UFormField>
          <UInput v-model="state.password.new" placeholder="Új jelszó" name="password" type="password" required />
        </UFormField>
        <UFormField>
          <UInput v-model="state.password.confirm" placeholder="Új jelszó megerősítése" name="password" type="password" required />
        </UFormField>
        <UButton type="submit" class="button">Mentés</UButton>
      </UForm>
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
</style>
