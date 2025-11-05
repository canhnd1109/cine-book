<script setup lang="ts">
import { apiPublic } from '~/services'

const { roomDetail } = useCinemaData()
const route = useRoute()

const {
  data,
  pending: isFetching,
  refresh
} = await useAsyncData('room-detail', async () => {
  const res = await apiPublic.getRoomDetail(route.params.id as string)
  console.log('🚀 ~ res.value:', res.value)
  return res.value
})

// watchEffect(() => {
//   roomDetail.value = data
// })
</script>
<template>
  <div>Movie</div>
</template>

<style scoped></style>
