<script setup lang="ts">
import { apiPublic } from '~/services'

const { filters, cinemas, apply } = useCinemaData()

const hoveredItem = ref<string | null>(null)

const { data, pending } = await useAsyncData('cinemas-list', async () => {
  const res = await apiPublic.fetchCinemas(filters.value)
  return res.value
})

watchEffect(() => {
  cinemas.value = data.value || []
})

const handleClickCinema = (cinemaId: string) => {
  navigateTo(`/cinema/${cinemaId}`)
}
</script>
<template>
  <div class="container mx-auto space-y-6 mb-10">
    <p class="text-3xl font-bold text-center">Danh sách rạp chiếu phim</p>

    <BaseInput
      v-model="filters.keyWord"
      :is-show-clear="true"
      @input="apply({ keyWord: filters.keyWord }, { debounce: true, resetPage: true })"
    />
    <BaseSkeletonCard v-if="pending" />
    <BaseEmpty v-else-if="!cinemas.length" />
    <div v-else class="grid-cols-5 gap-6 grid max-lg:grid-cols-4 max-md:grid-cols-3 max-sm:grid-cols-2">
      <div v-for="item in cinemas" :key="item.id" @click="handleClickCinema(item.id)">
        <BaseCard :item="item" :index="0" class="w-full" :show-actions="false">
          <template #image>
            <div class="flex items-center justify-center">
              <div
                class="relative flex items-center justify-center overflow-hidden rounded-lg w-full h-60"
                @mouseenter="hoveredItem = item.id"
                @mouseleave="hoveredItem = null"
              >
                <div class="image-container" :class="{ 'slide-active': hoveredItem === item.id }">
                  <img
                    :src="item.urlImages[0]"
                    :alt="item.name"
                    class="first-image absolute top-0 left-0 h-full w-full object-cover max-sm:object-center"
                  />
                  <img
                    v-if="item.urlImages.length > 1"
                    :src="item.urlImages[1]"
                    :alt="item.name"
                    class="second-image absolute top-0 left-0 h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </template>

          <template #content>
            <p class="mt-2 line-clamp-2 text-center font-medium">
              {{ item.name }}
            </p>
            <p>
              <span class="text-secondary text-sm">{{ $t('address') }}: </span>
              <span>{{ item.province }} - {{ item.commune }} - {{ item.detailAddress }}</span>
            </p>
            <p>
              <span class="text-secondary text-sm">{{ $t('phone') }}: </span>
              <span>{{ item.phone }}</span>
            </p>
            <p>
              <span class="text-secondary text-sm">{{ $t('description') }}: </span>
              <span>{{ item.description }}</span>
            </p>
          </template>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.first-image,
.second-image {
  transition: transform 0.4s ease;
}

.second-image {
  transform: translateX(100%);
}

.slide-active .first-image {
  transform: translateX(-100%);
}

.slide-active .second-image {
  transform: translateX(0);
}
</style>
