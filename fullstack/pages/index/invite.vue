<script setup lang="ts">
const date = new Date();
</script>
<template>
 <div>
   <h2>Meghívó a {{ date.toLocaleDateString("hu-HU", {
  year: "numeric",
  month: "long",
  day: "2-digit",
}) }} dátumú Ciklus-show foglalkozásra</h2>
   <p>Részletes adatok megtekintéséhez kérjük erősítse meg email címét.</p>
 </div>
</template>