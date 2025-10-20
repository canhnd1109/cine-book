<script setup lang="ts">
const { cinameDetail } = useCinemaData()
definePageMeta({
  layout: 'admin',
  middleware: ['admin']
})
</script>
<template>
  <div class="card-box">
    <div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2">
      <img v-for="(item, index) in cinameDetail.urlImages" :key="index" :src="item" class="w-full h-60 object-cover rounded" />
    </div>
    <p class="mt-2 line-clamp-2 text-center font-medium">
      {{ cinameDetail.name }}
    </p>
    <p>
      <span class="text-secondary text-sm">{{ $t('address') }}: </span>
      <span>{{ cinameDetail.province }} - {{ cinameDetail.commune }} - {{ cinameDetail.detailAddress }}</span>
    </p>
    <p>
      <span class="text-secondary text-sm">{{ $t('phone') }}: </span>
      <span>{{ cinameDetail.phone }}</span>
    </p>
    <p>
      <span class="text-secondary text-sm">{{ $t('description') }}: </span>
      <span>{{ cinameDetail.description }}</span>
    </p>
  </div>
</template>

<style scoped></style>
