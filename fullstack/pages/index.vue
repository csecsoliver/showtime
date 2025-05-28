<script setup lang="ts">


</script>

<template>
  <main>
    <div class="heading">
      <header>
        <!-- <img alt="Showtime-logo" class="logo" src="@/assets/logo.svg" width="125" height="125" /> -->
        <MainTitle/>
        <nav>
          <NuxtLink to="/">Home</NuxtLink>
          <NuxtLink to="/about">About</NuxtLink>
          <NuxtLink to="/login">Login/Register</NuxtLink>
        </nav>
      </header>
    </div>
    <NuxtPage />
  </main>
</template>

<style scoped>

.heading {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
main{}
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

  border-radius: 25px;
  background-color: var(--color-heading);
  padding: 0.5rem 2rem;
  margin-bottom: 1rem;
  margin-top: 0.5rem;
  margin-left: 1rem;
  margin-right: 1rem;
  width: calc(100% - 2rem);
}
@media (min-width: 800px) {
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 80%;

    padding: 1rem 2rem;
  }


}
</style>
