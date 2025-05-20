<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

import MainTitle from '@/components/MainTitle.vue'
</script>
<template>
  <header>

    <MainTitle></MainTitle>
    <nav>
<RouterLink to="/">Home</RouterLink>
    </nav>
  </header>
  <RouterView />
</template>
<style>
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

  background-color: var(--color-heading);
  padding: 0.5rem 2rem;

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

