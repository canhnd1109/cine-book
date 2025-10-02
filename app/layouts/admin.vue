<script setup lang="ts">
import AppHeaderAdmin from '~/components/admin/AppHeaderAdmin.vue'
import AppSidebarAdmin from '~/components/admin/AppSidebarAdmin.vue'
</script>

<template>
  <div class="h-screen flex w-screen">
    <AppSidebarAdmin />
    <div class="w-full">
      <AppHeaderAdmin />
      <NuxtPage />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
