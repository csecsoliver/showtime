<template>
  <main>
    <h2>Foglalkozások</h2>
      <table>
        <tbody>
          <tr>
            <th style="width: 30%;">Időpont</th>
            <th style="width: 20%;">Helyszín</th>
            <th style="width: 10%;">Létszám</th>
            <th style="width: 40%;">Műveletek</th>
          </tr>
          <tr>
            <td>
              2023.10.01 10:00
            </td>
            <td>
              Szeged
            </td>
            <td>
              4
            </td>
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
main {


  width: 100%;
  flex-wrap: wrap;
  margin: 1rem auto;
  width: 90%;
  overflow: scroll;
  scrollbar-width: none;
}
table{
  border-collapse: collapse;
  width: 100%;
}
th, td {
  border-collapse: collapse;
  border: 1px solid var(--sht-text);
  flex-wrap: wrap;
}
th {
  background-color: var(--sht-pink);
  font-weight: bold;
}
</style>
