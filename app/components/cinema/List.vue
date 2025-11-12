<script setup lang="ts">
import type { ICinema } from '~/types/cinema.type'
import type { IActionCard } from '~/types/constant.type'

const { cinemas, cinameDetail } = useCinemaData()

const { isFetching = false } = defineProps<{
  isFetching?: boolean
}>()
const hoveredItem = ref<string | null>(null)

const actionClick = (action: IActionCard, data: ICinema) => {
  cinameDetail.value = data
  if (action === 'EDIT') {
    console.log(action)
  } else if (action === 'VIEW') {
    navigateTo({ name: 'admin-cinemas-id', params: { id: cinameDetail.value.id } })
  } else {
    console.log(action)
  }
}
</script>

<template>
  <BaseSkeletonCard v-if="isFetching" />
  <BaseEmpty v-else-if="!cinemas.length" />
  <div v-else class="grid-cols-5 gap-6 grid max-lg:grid-cols-4 max-md:grid-cols-3 max-sm:grid-cols-2">
    <div v-for="item in cinemas" :key="item.id">
      <BaseCard :item="item" :index="0" class="w-full" @action-click="actionClick">
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
