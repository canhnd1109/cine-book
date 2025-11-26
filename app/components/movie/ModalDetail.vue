<script setup lang="ts">
import useFormatDate from '~/composables/useDateFormat'
import { apiPublic } from '~/services'
import type { IShowtime } from '~/types/show-time.type'

const { t } = useI18n()
const { movieDetail } = useMovieData()
const route = useRoute()
const router = useRouter()

const isOpen = defineModel('isOpen', { type: Boolean, default: false })
const showTime = ref<IShowtime[]>([])
const isLoading = ref(false)
const tabs = computed(() => [
  { key: 'create', label: t('setting-showtime') as string },
  { key: 'manage', label: t('manage-showtimes') as string }
])

const activeTab = ref('create')

watch(
  () => isOpen.value,
  newValue => {
    if (newValue) {
      // Sync tab from query or set default
      const queryTab = route.query.tab as string
      if (queryTab && tabs.value.some((tab: { key: string }) => tab.key === queryTab)) {
        activeTab.value = queryTab
      } else {
        activeTab.value = 'create'
        updateQuery('create')
      }
    } else {
      // Remove query when modal closes
      removeQuery()
    }
  }
)

// Watch activeTab and update query
watch(activeTab, async newTab => {
  if (isOpen.value) {
    updateQuery(newTab)
  }
})

onMounted(() => {
  if (route.query.modal === 'detail' && route.query.movieId) {
    isOpen.value = true
    const queryTab = route.query.tab as string
    if (queryTab && tabs.value.some((tab: { key: string }) => tab.key === queryTab)) {
      activeTab.value = queryTab
    } else {
      activeTab.value = 'create'
      updateQuery('create')
    }
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

const handleOpen = () => {
  if (activeTab.value === 'manage') {
    const { data, pending } = useAsyncData(
      `showtimes-${route.query.movieId}`,
      async () => {
        if (!route.query.movieId) return null
        return apiPublic.fetchShowtimesByMovie(route.query.movieId as string).then(res => res.value)
      },
      { watch: [() => route.query.movieId] }
    )

    showTime.value = data.value || []

    watch(
      pending,
      value => {
        isLoading.value = value
      },
      { immediate: true }
    )
    watch(
      data,
      value => {
        showTime.value = value || []
      },
      { immediate: true }
    )
  }
}
</script>
<template>
  <UModal v-model:open="isOpen" :title="t('movie-detail')" @after:enter="handleOpen">
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

      <div v-if="activeTab === 'create'">
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
      <!-- Tab 2: Manage Showtimes -->
      <div v-else-if="activeTab === 'manage'">
        <div class="min-h-[300px] flex items-center justify-center text-gray-500">
          <div v-if="isLoading">
            <p>fds</p>
          </div>
          <div v-else>
            {{ showTime }}
          </div>
        </div>
      </div></template
    >
  </UModal>
</template>

<style scoped></style>
