<template>
  <UModal title="Új foglalkozás létrehozása" size="sm" >
    <UButton label="Open"  class="button"  />

    <template #body>
        <form action="/api/workshop" method="post" class="flex flex-col gap-4">
            <label for="town">Város</label>
            <input id="town" class="" type="text" name="town" required>
            <label for="date">Dátum</label>
            <input id="date" type="datetime" name="date" required>
            <div>
              <label for="open" class="mr-4">Nyílt foglalkozás</label>
              <input id="open" type="checkbox" name="open">
            </div>
            <button type="submit" class="button">Létrehozás</button>
        </form>
    </template>
  </UModal>
</template>
<style scoped>


</style>