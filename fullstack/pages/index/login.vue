<script setup lang="ts">
import { ref } from 'vue'
const username = ref('')
const password = ref('')
const password2 = ref('')
const loading = ref(false)
const register  = ref(false);
const match = ref('');
async function handleLogin(): Promise<void> {
  if (password.value != password2.value && register.value == true){
    match.value = "A Jelszavaknak meg kell egyeznie!"
    return
  }
  const tosend = { username: username.value, password: password.value, option: register.value?"register":"login" }
  const response = fetch('/api/login', {
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
  
  register.value = !register.value;

}
async function resetMatch() {
match.value = ''
}
</script>
<template>
  
    <div class="login-form">
      <form name="login-form" @submit.prevent="handleLogin()">
        <label for="username">E-mail:</label>
        <input id="username" v-model="username" type="text" required >
        <label for="password">Jelszó:</label>
        <input id="password" v-model="password" type="password" required @change="resetMatch()">
        <label id="password2l" for="password2" :style="{ display: register ? 'block' : 'none' }">Jelszó megerősítése:</label>
        <input id="password2" v-model="password2"  type="password" :required="register" :style="{ display: register ? 'block' : 'none' }"  @change="resetMatch()" >
        <p style="color:red;">{{ match }}</p>
        <button id="submit" type="submit" :disabled="loading">{{ register ? "Regisztrálás" : "Bejelentkezés" }}</button>
        <a id="reg" href="" @click.prevent="signup()">{{ register ? "Bejelentkezés" : "Regisztrálás" }}</a>
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
