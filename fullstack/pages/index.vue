<script setup lang="ts">


</script>

<template>
  <div>
    <div class="heading flex justify-center items-center">
      <header class="lg:flex justify-between lg:w-4/5 w-9/10 rounded-2xl bg-pink py-2 px-8 my-4">
        <!-- <img alt="Showtime-logo" class="logo" src="@/assets/logo.svg" width="125" height="125" /> -->
        <MainTitle/>
        <nav class="flex flex-wrap font-bold">
          <NuxtLink to="/">Főoldal</NuxtLink>
          <NuxtLink to="/workshops">Foglalkozások</NuxtLink>
          <NuxtLink to="/login">Bejelentkezés/Regisztráció</NuxtLink>
        </nav>
      </header>
    </div>
    <NuxtPage class="px-8" />
  </div>
</template>

<style scoped>

nav a {
  margin-right: 1rem;
  padding: 0.2rem 0.5rem;
}

</style>
