<script setup lang="ts">
definePageMeta({
  middleware: [
    'auth',
  ],
});
</script>
<template>
  <div>
    <header>
      <DashTitle/>
      <nav>
        <NuxtLink to="/dashboard">Kezdőlap</NuxtLink>
        <NuxtLink to="/dashboard/sessions">Foglalkozások</NuxtLink>
        <NuxtLink to="/dashboard/calendar">Naptár</NuxtLink>
        <NuxtLink to="/dashboard/settings">Beállítások</NuxtLink>
      </nav>
    </header>
    <NuxtPage />
  </div>
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
