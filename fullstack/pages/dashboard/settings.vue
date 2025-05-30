<template>
<main class="flex flex-wrap gap-4">
  <div>
    <h2>Beállítások</h2>
    <ul>
      <li>Example 1</li>
    </ul>
  </div>
  <div>
    <h2>Gyorsműveletek</h2>
    <button class="button">Új foglalkozás</button>
    <button class="button">Meghívók</button>
  </div>
  <div>
    <h2>Profil</h2>
    <button class="button">Profil szerkesztése</button>
    <button class="button">Jelszó módosítása</button>
    <button class="button">Profil törlése</button>
  </div>
  <div>
    <h2>Fiók</h2>



  </div>
</main>
</template>
<style scoped>

main > div {
  width: 30rem;
  padding: 0.7rem 1rem;
  margin: 0.5rem;
  border: 1px solid var(--sht-text);
  border-radius: 10px;
  height: fit-content;
}
.button {
  margin-right: 1rem;
  margin-bottom: 0.5rem;
  width: fit-content;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}
h2 {
  font-weight: bold;
  font-size: 1.25rem;
  margin-bottom :0.5rem ;
}
</style>
