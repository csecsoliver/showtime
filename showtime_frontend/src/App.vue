<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import MainTitle from '@/components/MainTitle.vue'

</script>

<template>
  <header>
    <!-- <img alt="Showtime-logo" class="logo" src="@/assets/logo.svg" width="125" height="125" /> -->

    <MainTitle> </MainTitle>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <a href="/login">Login/Register</a>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
nav a {
  margin-right: 1rem;
  color: var(--color-text);
  font-weight: bold;
  padding: 0.2rem 0.5rem;
}
nav {
    display: flex;

}
header {

  border-radius: 25px;
  background-color: var(--color-heading);
  padding: 0.5rem 2rem;
  margin-bottom: 1rem;
  margin-top: 0.5rem;
  margin-left: auto;
  margin-right: auto;
}
@media (min-width: 1024px) {
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 80%;
    margin: 0.5rem inherit auto auto;

    padding: 1rem 2rem;
  }


}
</style>
