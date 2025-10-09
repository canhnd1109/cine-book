<script setup lang="ts">
const { skeletonCards = 5 } = defineProps<{
  skeletonCards?: number
}>()

const gridClass = 'grid-cols-[repeat(auto-fit,minmax(200px,1fr))]'
</script>
<template>
  <div class="mx-auto grid gap-6" :class="gridClass">
    <template v-for="(_item, index) in skeletonCards" :key="index">
      <div class="border border-solid border-border-light dark:border-border-dark p-4 rounded-lg space-y-4">
        <USkeleton class="h-60 w-full" />
        <USkeleton class="h-32 w-full" />
      </div>
    </template>
  </div>
</template>
