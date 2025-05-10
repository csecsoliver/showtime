<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import MainTitle from '@/components/MainTitle.vue'
</script>

<template>
  <header>
    <img alt="Showtime-logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <MainTitle> </MainTitle>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <a href="/views/LoginScreen.vue">Login</a>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
  nav a{
    margin-right: 1rem;
    color: #42b983;
    font-weight: bold;
  }
  nav{
    margin-top: 1rem;
  }
</style>
