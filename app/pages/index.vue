<template>
  <div>
    <UCarousel
      v-slot="{ item }"
      dots
      autoplay
      loop
      :auto-height="true"
      :items="items"
      :ui="{
        dots: '!bottom-0 !-mt-32',
        dot: '!bottom-0 !-mt-32'
      }"
    >
      <img
        :src="item"
        class="w-full h-auto mx-auto"
      >
    </UCarousel>
  </div>
</template>

<script setup lang="ts">
// const { t } = useI18n()
const items = [
  '/images/phim-8.png',
  '/images/phim-7.png',
  '/images/phim-6.png',
  '/images/phim-5.png',
  '/images/phim-4.png',
  '/images/phim-3.png',
  '/images/phim-2.png',
  '/images/phim-1.png'
]
</script>

<style scoped>

</style>
