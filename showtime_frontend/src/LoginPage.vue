<script setup lang="ts">
import { ref } from 'vue';
const username = ref('')
const password = ref('')
function handleLogin(): void {
  return

}
</script>
<template>
  <header>
    <h1>Login</h1>
  </header>
  <div class="login-form">
    <form @submit.prevent="handleLogin" name="login-form">
      <label for="username">E-mail:</label>
      <input type="text" id="username" v-model="username" required />

      <label for="password">Password:</label>
      <input type="password" id="password" v-model="password" required />

      <button type="submit">Login</button>
    </form>
  </div>
</template>
<style scoped>
header {
  display: flex;
  align-items: center;
  justify-content: center;
}
form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
}
form * {
  margin: 10px 0;
}
input {
  padding: 0.5rem;
  border: 1px solid var(--sht-pink);
  border-radius: 10px;
}
button {
  width: 8rem;
  height: 2rem;
  background-color: var(--sht-pink);
  color: white;
  font: inherit;

  font-weight: bold;
  border: 1px solid var(--color-text);
  border-radius: 10px;
  cursor: pointer;
}
</style>
