<script setup lang="ts">
useSeoMeta({ title: 'Components' })
</script>

<template>
  <div class="flex">
    <!-- Sidebar -->
    <aside class="flex items-start justify-center w-64 overflow-y-auto border-r rtl:border-r-0 rtl:border-l">
      <div class="flex flex-col justify-start items-start">
        <span class="text-2xl font-bold">Components</span>
        <div class="flex flex-col justify-between flex-1 mt-6">
          <nav class="-mx-3 space-y-6">
            <div class="space-y-3">
              <NuxtLink
                class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg"
                to="/components/button"
              >
                <span>Button</span>
              </NuxtLink>
              <NuxtLink
                class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg"
                to="/components/pagination"
              >
                <span>Pagination</span>
              </NuxtLink>
            </div>
          </nav>
        </div>
      </div>
    </aside>

    <!-- Content -->
    <div class="flex-1 h-screen overflow-y-auto">
      <NuxtPage />
    </div>
  </div>
</template>

<style scoped>
.router-link-active {
  font-weight: 600;
  font-size: 16px;
  color: #314158;
}
.dark .router-link-active {
  font-weight: 600;
  font-size: 16px;
  color: #fff;
}
</style>
