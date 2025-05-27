<template>
  <UModal title="Új foglalkozás létrehozása" size="sm">
    <UButton label="Open" color="neutral" variant="subtle" />

    <template #body>
        <form action="/api/workshop" method="post">
            <label for="town">Város</label>
            <input id="town" type="text" name="town" required>
            <label for="date">Dátum</label>
            <input id="date" type="datetime" name="date" required>
            <label for="open">Nyílt foglalkozás</label>
            <input id="open" type="checkbox" name="open">
        </form>
    </template>
  </UModal>
</template>
<style scoped>


</style>