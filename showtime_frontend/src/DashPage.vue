<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

import DashTitle from '@/components/DashTitle.vue'
</script>
<template>
  <header>
    <DashTitle></DashTitle>
    <nav>
      <RouterLink to="/dashboard">Kezdőlap</RouterLink>
      <RouterLink to="/dashboard/sessions">Foglalkozások</RouterLink>
      <RouterLink to="/dashboard/calendar">Naptár</RouterLink>
      <RouterLink to="/dashboard/settings">Beállítások</RouterLink>
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
  flex-wrap: wrap;
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
    margin: 0.5rem inherit auto auto;

    padding: 1rem 2rem;
  }
}
h2 {
    font-weight: bold;
    font-size: 1.25rem;
  }
</style>
