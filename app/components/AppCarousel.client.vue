<script setup lang="ts">
const props = defineProps<{
  items: string[]
}>()
</script>

<template>
  <UCarousel
    v-slot="{ item }"
    dots
    autoplay
    loop
    :auto-height="true"
    :items="props.items"
    :ui="{
      dots: '!bottom-0 !-mt-32',
      dot: '!bottom-0 !-mt-32'
    }"
  >
    <img
      :src="item"
      class="w-full h-auto mx-auto rounded-2xl"
    >
  </UCarousel>
</template>
