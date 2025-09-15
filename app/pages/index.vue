<template>
  <div>
    <h1>{{ t('app.title') }}</h1>
    <p>{{ t('app.description') }}</p>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>

<style scoped>

</style>
