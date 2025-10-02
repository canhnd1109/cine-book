<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['admin'] })
</script>

<template>
  <div class="space-y-4">
    <MoviesTabs />
    <div class="p-4 dark:bg-bg-primary-dark bg-bg-light rounded-2xl mr-6">
      <h2>Movies Tab</h2>
    </div>
  </div>
</template>
