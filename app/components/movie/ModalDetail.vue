<script setup lang="ts">
import useFormatDate from '~/composables/useDateFormat'
import { apiPublic } from '~/services'

const { t } = useI18n()
const { movieDetail } = useMovieData()
const route = useRoute()
const router = useRouter()

const isOpen = defineModel('isOpen', { type: Boolean, default: false })
const tabs = computed(() => [
  { key: 'detail', label: t('movie-detail') as string },
  { key: 'showtimes', label: t('manage-showtimes') as string }
])

const activeTab = ref('detail')

// Fetch showtimes with lazy loading
const {
  data,
  pending,
  execute: fetchShowtimes
} = await useAsyncData(
  () => `showtimes-${route.query.movieId}`,
  async () => {
    if (!route.query.movieId) return []
    const res = await apiPublic.fetchShowtimesByMovie(route.query.movieId as string)
    return res.value || []
  },
  {
    immediate: false,
    default: () => []
  }
)

// Sync tab from query and handle data fetching
const syncTabAndFetch = async (queryTab?: string) => {
  if (queryTab && tabs.value.some((tab: { key: string }) => tab.key === queryTab)) {
    activeTab.value = queryTab
  } else {
    activeTab.value = 'detail'
  }

  // Fetch showtimes if on showtimes tab and no data yet
  if (activeTab.value === 'showtimes' && (!data.value || data.value.length === 0)) {
    await fetchShowtimes()
  }
}

// Watch modal open/close
watch(
  () => isOpen.value,
  async newValue => {
    if (newValue) {
      const queryTab = route.query.tab as string
      await syncTabAndFetch(queryTab)

      if (!queryTab || queryTab !== activeTab.value) {
        updateQuery(activeTab.value)
      }
    } else {
      removeQuery()
    }
  }
)

// Watch tab changes
watch(activeTab, async newTab => {
  if (isOpen.value) {
    updateQuery(newTab)

    if (newTab === 'showtimes' && (!data.value || data.value.length === 0)) {
      await fetchShowtimes()
    }
  }
})

// Auto-open modal from query on mount
onMounted(async () => {
  if (route.query.modal === 'detail' && route.query.movieId) {
    isOpen.value = true
  }
})

const updateQuery = (tab: string) => {
  const currentQuery = { ...route.query }
  router.push({
    query: {
      ...currentQuery,
      tab,
      modal: 'detail',
      movieId: currentQuery.movieId || movieDetail.value?.id
    }
  })
}

const removeQuery = () => {
  const { tab, modal, movieId, ...restQuery } = route.query
  router.push({ query: restQuery })
}
</script>
<template>
  <UModal v-model:open="isOpen" :title="t('movie-detail')">
    <template #body>
      <!-- Tabs Navigation -->
      <div class="mb-6">
        <div class="flex border-b border-gray-200 dark:border-gray-700">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            :class="[
              'px-4 py-2 font-medium transition-colors',
              activeTab === tab.key
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            ]"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Tab: Movie Detail -->
      <div v-if="activeTab === 'detail'">
        <img :src="movieDetail.posterUrl" :alt="movieDetail.name" class="w-1/2 h-96 mx-auto rounded-lg shadow-md object-cover" />

        <p class="mt-2 line-clamp-2 text-center font-medium">
          {{ movieDetail.name }}
        </p>
        <p>
          <span class="text-[#90a1b9] text-sm">{{ $t('genres') }}: </span>
          <span>{{ movieDetail.genres.join(', ') }}</span>
        </p>
        <p>
          <span class="text-[#90a1b9] text-sm">{{ $t('director') }}: </span>
          <span>{{ movieDetail.director }}</span>
        </p>
        <p>
          <span class="text-[#90a1b9] text-sm">{{ $t('performer') }}: </span>
          <span>{{ movieDetail.performer }}</span>
        </p>
        <p>
          <span class="text-[#90a1b9] text-sm">{{ $t('releaseDate') }}: </span>
          <span>{{ useFormatDate(movieDetail.releaseDate, 'DD/MM/YYYY hh:mm:ss') }}</span>
        </p>
        <p>
          <span class="text-[#90a1b9] text-sm">{{ $t('closeDate') }}: </span>
          <span>{{ useFormatDate(movieDetail.closeDate, 'DD/MM/YYYY hh:mm:ss') }}</span>
        </p>
        <p>
          <span class="text-[#90a1b9] text-sm">{{ $t('nation') }}: </span>
          <span>{{ movieDetail.nation }}</span>
        </p>
        <p>
          <span class="text-[#90a1b9] text-sm">{{ $t('duration') }}: </span>
          <span>{{ movieDetail.duration }}</span>
        </p>

        <p>
          <span class="text-[#90a1b9] text-sm">{{ $t('price-ticket') }}: </span>
          <span>{{ formatPrice(movieDetail.price) }}</span>
        </p>
        <p>
          <span class="text-[#90a1b9] text-sm">{{ $t('comment') }}: </span>
          <span>{{ formatNumber(movieDetail.totalComment) }}</span>
        </p>

        <p class="flex justify-start items-center gap-2">
          <span class="text-[#90a1b9] text-sm">{{ $t('note') }}: </span>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span class="text-text-error line-clamp-3" v-html="movieDetail.note" />
        </p>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p class="line-clamp-3" v-html="movieDetail.description" />
      </div>

      <!-- Tab: Showtimes -->
      <div v-else-if="activeTab === 'showtimes'">
        <div v-if="pending" class="min-h-[300px] flex items-center justify-center">
          <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin text-primary" />
        </div>
        <div v-else-if="!data || data.length === 0" class="min-h-[300px] flex items-center justify-center text-gray-500">
          <p>{{ t('no-showtimes-available') }}</p>
        </div>
        <div v-else class="space-y-4">
          {{ data }}
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped></style>
