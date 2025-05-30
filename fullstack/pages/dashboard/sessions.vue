<template>
  <main class="flex flex-wrap justify-center items-center mt-4">
    
    <table class="table-auto w-9/10">
      <thead>
        <tr><th colspan="4"><h2>Foglalkozások</h2></th></tr>
        
      </thead>
      <tbody>
        <tr>
          <th style="width: 30%">Időpont</th>
          <th style="width: 20%">Helyszín</th>
          <th style="width: 10%">Létszám</th>
          <th style="width: 40%">Műveletek</th>
        </tr>
        <tr>
          <td>2023.10.01 10:00</td>
          <td>Szeged</td>
          <td>4</td>
          <td>
            <button class="button">Részletek</button>
            <button class="button">Megívó</button>
            <button class="button">Lemondás</button>
          </td>
        </tr>
      </tbody>
    </table>
  </main>
</template>
<style scoped>
th,
td {
  border-collapse: collapse;
  border: 1px solid var(--sht-text);
  flex-wrap: wrap;
}
th {
  background-color: var(--sht-pink);
  font-weight: bold;
}
</style>
