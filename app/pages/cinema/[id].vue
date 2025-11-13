<script setup lang="ts">
import { apiPublic } from '~/services'

const route = useRoute()
const router = useRouter()
const dateRange = generateDateRange()

const selectedDateApi = computed(() => activeDate.value.apiFormat)

const getInitialDate = () => {
  const dateParam = route.query.date as string
  return dateParam ? (dateRange.find(d => d.apiFormat === dateParam) ?? dateRange[0]!) : dateRange[0]!
}
const activeDate = ref<DateItem>(getInitialDate())
const { data: movies, pending, refresh } = useFetchMoviesByCinemaByDay(route.params.id as string, selectedDateApi)

watch(selectedDateApi, () => refresh(), { immediate: true })

const changeDate = (item: DateItem) => {
  activeDate.value = item
  router.push({ query: { date: item.apiFormat } })
}

const handleMovieClick = (movieId: string) => {
  router.push({ name: 'cinema-id', params: { id: movieId } })
}

const { data } = await useAsyncData(`cinema-detail-${route.params.id}`, async () => {
  const res = await apiPublic.getCinemaDetail(route.params.id as string)
  return res.value
})

const fullAddress = computed(() => {
  return `${data.value!.detailAddress}, ${data.value!.commune}, ${data.value!.province}, Vietnam`
})

const mapUrl = computed(() => {
  const encodedAddress = encodeURIComponent(fullAddress.value)
  return `https://maps.google.com/maps?q=${encodedAddress}&output=embed`
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
    <div class="flex justify-center flex-wrap gap-4">
      <BaseButton
        v-for="(item, index) in dateRange"
        :key="index"
        :text="item.isToday ? 'Hôm nay' : item.formatted"
        :variant="item.formatted === activeDate.formatted ? 'solid' : 'outline'"
        class-name="rounded-lg"
        @click="changeDate(item)"
      />
    </div>
    {{ movies }}
    <div class="w-5xl container mx-auto">
      <iframe
        :src="mapUrl"
        width="100%"
        height="400"
        style="border: 0"
        allowfullscreen="false"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        class="rounded-lg"
      />
      <p class="mt-4">{{ data?.description }}</p>
    </div>
  </div>
</template>

<style scoped></style>
