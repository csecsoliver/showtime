<script setup lang="ts">
import type { NuxtError } from "#app";
import { ref } from "vue";
const toast = useToast();
const username = ref("");
const password = ref("");
const password2 = ref("");
const loading = ref(false);
const register = ref(false);
const match = ref("");
async function handleLogin(): Promise<void> {
  if (password.value != password2.value && register.value == true) {
    match.value = "A Jelszavaknak meg kell egyeznie!";
    return;
  }
  const tosend = {
    username: username.value,
    password: password.value,
    option: register.value ? "register" : "login",
  };
  const response = $fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tosend),
  });

  document.getElementById("submit")?.classList.add("loading");
  loading.value = true;
  try {
    await response;
  } catch (error) {
    switch ((error as NuxtError).statusMessage) {
      case "userExistsError":
        toast.add({
          title: "Felhasználó már létezik ezzel az e-mail címmel",
          color: "error",
        });
        break;
      case "loginFailed":
        toast.add({
          title: "A felhasználónév vagy a jelszó hibás",
          color: "error",
        });
        break;
      case "passwordError":
        toast.add({
          title: "A jelszó nem felel meg a követelményeknek: min 8, max 72 karakter",
          color: "error",
        });
        break;
      default:
        toast.add({
          title: "Hiba történt, kérjük, jelentse a fejlesztőknek",
          color: "error",
        });
    }
  }
  loading.value = false;
  console.log("Login response:", response);

  // navigateTo('/dashboard');
  location.href = "/dashboard";

}

async function signup() {
  register.value = !register.value;
}
async function resetMatch() {
  match.value = "";
}
</script>
<template>
  <div class="login-form">
    <form
      name="login-form"
      class="flex flex-col items-center justify-center mt-4"
      @submit.prevent="handleLogin()"
    >
      <label for="username">E-mail:</label>
      <input
        id="username"
        v-model="username"
        class="bg-white"
        type="text"
        required
      >
      <label for="password">Jelszó:</label>
      <input
        id="password"
        v-model="password"
        class="bg-white"
        type="password"
        required
        @change="resetMatch()"
      >
      <label
        id="password2l"
        for="password2"
        :style="{ display: register ? 'block' : 'none' }"
        >Jelszó megerősítése:</label
      >
      <input
        id="password2"
        v-model="password2"
        class="bg-white"
        type="password"
        :required="register"
        :style="{ display: register ? 'block' : 'none' }"
        @change="resetMatch()"
      >
      <p style="color: red">{{ match }}</p>
      <button id="submit" class="button" type="submit" :disabled="loading">
        {{ register ? "Regisztrálás" : "Bejelentkezés" }}
      </button>
      <a id="reg" href="" @click.prevent="signup()">{{
        register ? "Bejelentkezés" : "Regisztrálás"
      }}</a>
    </form>
  </div>
</template>
<style scoped>
input {
  padding: 0.5rem;
  border: 1px solid var(--sht-pink);
  border-radius: 10px;
  margin-top: 0;
  margin-bottom: 1rem;
}
label {
  margin-bottom: 0.25rem;
}

#password2,
#password2l {
  display: none;
}
</style>
