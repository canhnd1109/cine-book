<script setup lang="ts">
import AppHeaderAdmin from '~/components/admin/AppHeaderAdmin.vue'
import AppSidebarAdmin from '~/components/admin/AppSidebarAdmin.vue'
</script>

<template>
  <div class="h-screen flex w-screen dark:bg-bg-primary-dark bg-bg-light">
    <AppSidebarAdmin />

    <div class="flex flex-col w-full h-screen overflow-hidden">
      <AppHeaderAdmin />
      <div class="flex-1 overflow-y-auto">
        <NuxtPage />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
