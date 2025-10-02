<script setup lang="ts">
import TheHeaderAdmin from '~/components/admin/TheHeaderAdmin.vue'
import TheSidebarAdmin from '~/components/admin/TheSidebarAdmin.vue'
</script>

<template>
  <div class="h-screen flex w-screen">
    <TheSidebarAdmin />
    <div class="w-full">
      <TheHeaderAdmin />
      <NuxtPage />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
