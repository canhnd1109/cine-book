<script setup lang="ts">
import { apiPublic } from '~/services'

const route = useRoute()

const { data } = await useAsyncData(`cinema-detail-${route.params.id}`, async () => {
  const res = await apiPublic.getCinemaDetail(route.params.id as string)
  return res.value
})
</script>
<template>
  <div class="space-y-6 mb-10">
    <UCarousel
      v-slot="{ item }"
      class-names
      loop
      dots
      :autoplay="{ delay: 4000 }"
      :items="data?.urlImages"
      :ui="{
        item: 'basis-[60%] transition-opacity [&:not(.is-snapped)]:opacity-10 ps-10 h-[400px]',
        dots: 'absolute bottom-4 left-1/2 -translate-x-1/2',
        dot: 'bg-white/50 hover:bg-white w-3 h-3'
      }"
      class="mx-auto"
    >
      <img :src="item" class="rounded-lg w-full h-full object-cover" />
    </UCarousel>
    <div class="space-y-2 container mx-auto">
      <p class="text-2xl font-bold">{{ data?.name }}</p>
      <p><span class="text-secondary">Địa chỉ:</span> {{ data?.province }} - {{ data?.commune }} - {{ data?.detailAddress }}</p>
      <p><span class="text-secondary">Hotline:</span> {{ formatPhoneNumber(data!.phone) }}</p>
    </div>
  </div>
</template>

<style scoped></style>
