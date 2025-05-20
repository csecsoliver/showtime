<script setup lang="ts">
import { ref } from 'vue'
const username = ref('')
const password = ref('')
const password2 = ref('')
const loading = ref(false)
let register  = false;

async function handleLogin(): Promise<void> {

  const tosend = { username: username.value, password: password.value, option: register?"register":"login" }
  const response = fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    body: JSON.stringify(tosend),
  })


  document.getElementById("submit")?.classList.add("loading")
  loading.value = true;
  const res = await response;
  document.getElementById("submit")?.classList.remove("loading")
  loading.value = false;
  window.alert(await res.text());
}

async function signup(){
  const el = document.getElementById("password2");
  const el2 = document.getElementById("password2l");
  const btn = document.getElementById("submit");
  const reg = document.getElementById("reg");
  if (el instanceof HTMLElement) {
    el.style.display = "block";
  }
  if (el2 instanceof HTMLElement){
    el2.style.display = "block"
  }
  if (btn instanceof HTMLElement){
    btn.innerText = "Regisztrálás"
  }
  if (reg instanceof HTMLElement){
    reg.style.display = "none"
  }
  register = true;

}

</script>
<template>
  <header>
    <h1>Login/Register</h1>
  </header>
    <div class="login-form">
      <form @submit.prevent="handleLogin()" name="login-form">
        <label for="username">E-mail:</label>
        <input type="text" id="username" v-model="username" required />
        <label for="password">Jelszó:</label>
        <input type="password" id="password" v-model="password" required />
        <label for="password2" id="password2l">Jelszó megerősítése:</label>
        <input type="password" id="password2" v-model="password2" :required="register" />
        <button type="submit" id="submit" :disabled="loading">Bejelentkezés</button>

        <a href="" @click.prevent="signup()" id="reg">Regisztrálás</a>
      </form>
    </div>

</template>
<style scoped>
h1{
  margin-top: 1rem;
}
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
label{
 margin-bottom: 0;
}
#mode{
  margin: 0 auto;
  width: fit-content;
}
#password2, #password2l{
  display: none;
}

</style>
