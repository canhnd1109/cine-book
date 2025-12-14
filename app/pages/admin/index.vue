<script setup lang="ts">
import { apiStatistics } from '~/services'

definePageMeta({ layout: 'admin', middleware: ['admin'] })

const { t } = useI18n()
const { resetFilter: resetMovieFilter } = useMovieData()
const { resetFilter: resetCinemaFilter } = useCinemaData()

const { data, pending, refresh } = useLazyAsyncData('genres-list', async () => {
  const res = await apiStatistics.getSummary()
  return res.value
})

await Promise.all([resetMovieFilter(), resetCinemaFilter()])
const summaries = computed(() => {
  return [
    {
      label: t('total-movies'),
      value: data.value?.totalMovies || 0
    },
    {
      label: t('total-cinemas'),
      value: data.value?.totalCinemas || 0
    },
    {
      label: t('total-rooms'),
      value: data.value?.totalRooms || 0
    },
    {
      label: t('total-bookings'),
      value: formatNumber(data.value?.totalBookings || 0)
    },
    {
      label: t('total-revenue'),
      value: formatPrice(data.value?.totalRevenue || 0)
    }
  ]
})
</script>

<template>
  <div class="space-y-6 m-6 rounded-lg">
    <!-- Summary Cards -->
    <UCarousel v-slot="{ item }" wheel-gestures :items="summaries" :ui="{ item: 'basis-1/4' }">
      <div class="dark:bg-bg-seconary-dark bg-white rounded-xl p-6 space-y-2">
        <p class="font-medium">{{ item.label }}</p>
        <p class="text-3xl text-secondary font-semibold">{{ item.value }}</p>
      </div>
    </UCarousel>

    <!-- Revenue Chart -->
    <AdminRevenueChart />
  </div>
</template>

<style scoped></style>
