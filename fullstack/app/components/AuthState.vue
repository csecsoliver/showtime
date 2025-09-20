<template>
  <div>
    <p>{{ email }} email címmel van bejelentkezve</p>
  </div>
</template>

<script lang="ts" setup>
import type { SessionData } from '~/server/types/types';


const email = ref((useUserSession().user.value as SessionData)?.name);
</script>

<style>

</style>