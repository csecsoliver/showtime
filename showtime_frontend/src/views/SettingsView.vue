<template>
<main>
  <div>
    <h2>Beállítások</h2>
    <ul>
      <li>Example 1</li>
    </ul>
  </div>
  <div>
    <h2>Gyorsműveletek</h2>
    <button>Új foglalkozás</button>
    <button>Meghívók</button>
  </div>
  <div>
    <h2>Profil</h2>
    <button>Profil szerkesztése</button>
    <button>Jelszó módosítása</button>
    <button>Profil törlése</button>
  </div>
  <div>
    <h2>Fiók</h2>



  </div>
</main>
</template>
<style scoped>
main {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
main > div {
  width: 30rem;
  padding: 0.2rem 0.5rem;
  margin: 0.5rem;
  border: 1px solid var(--sht-text);
  border-radius: 10px;
  height: fit-content;
}
button {
  margin: 0.5rem;
  width: fit-content;
}
h2 {
  font-weight: bold;
  font-size: 1.25rem;
}
</style>
