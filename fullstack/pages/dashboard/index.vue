<script setup lang="ts">
import { CreateWorkshop } from '#components';
async function refresh() {
  const response = await $fetch('/api/workshops', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },

  });
  const data = await response;
  console.log(data);
}
</script>
<template>
  <main>
    <div>
      <h2>Következő foglalkozások</h2>
      <ul>
        <li>Example 1</li>
      </ul>
    </div>
    <div>
      <h2>Gyorsműveletek</h2>
      <CreateWorkshop/>
      <button class="button">Meghívók</button>
    </div>


  </main>
</template>

<style scoped>
  main {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
    width: 100%;
    flex-wrap: wrap;
  }
  main > div {
    width : 30rem;
    padding: 0.2rem 0.5rem;
    margin: 0.5rem;
    border: 1px solid var(--sht-text);
    border-radius: 10px;
    height: fit-content;
  }

  button{
    margin: 0.5rem;
  }
</style>
