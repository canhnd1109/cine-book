<script setup lang="ts">
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui'
import useFormatDate from '~/composables/useDateFormat'
import { apiPublic, apiShowtime } from '~/services'
import type { IShowtime, IShowtimeTable } from '~/types/show-time.type'

const { t } = useI18n()
const { movieDetail, movieShowtimeSetting } = useMovieData()
const route = useRoute()
const router = useRouter()
const toast = useToast()

const isOpen = defineModel('isOpen', { type: Boolean, default: false })
const isConfirmOpen = ref(false)
const showTimeDetail = ref<IShowtimeTable>({} as IShowtimeTable)
const isDeleting = ref(false)

const tabs = computed(() => [
  { key: 'detail', label: t('movie-detail') as string },
  { key: 'showtimes', label: t('manage-showtimes') as string }
])

const activeTab = ref('detail')

const emit = defineEmits<{
  edit: []
}>()

const {
  data: rawData,
  pending,
  execute: fetchShowtimes
} = useAsyncData(
  `showtimes-${route.query.movieId}`,
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

// Flatten cinema data for table display
const data = computed(() => {
  if (!rawData.value) return []
  return flattenCinemaData(rawData.value)
})

// Sync tab from query and handle data fetching
const syncTabAndFetch = async (queryTab?: string) => {
  if (queryTab && tabs.value.some((tab: { key: string }) => tab.key === queryTab)) {
    activeTab.value = queryTab
  } else {
    activeTab.value = 'detail'
  }

  // Fetch showtimes if on showtimes tab and no data yet
  if (activeTab.value === 'showtimes' && (!rawData.value || rawData.value.length === 0)) {
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

    if (newTab === 'showtimes') {
      await fetchShowtimes()
    }
  }
})

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

function flattenCinemaData(data: IShowtime[]) {
  const result: IShowtimeTable[] = []

  data.forEach(cinema => {
    cinema.showtimeDetails.forEach(showtime => {
      result.push({
        cinemaId: cinema.cinemaId,
        cinemaName: cinema.cinemaName,
        province: cinema.province,
        district: cinema.district,
        commune: cinema.commune,
        detailAddress: cinema.detailAddress,
        id: showtime.id,
        date: showtime.date,
        startTime: showtime.startTime,
        endTime: showtime.endTime,
        roomId: showtime.roomResponse.roomId,
        name: showtime.roomResponse.name,
        totalRow: showtime.roomResponse.totalRow,
        totalCol: showtime.roomResponse.totalCol
      })
    })
  })

  return result
}

const columns = computed<TableColumn<IShowtimeTable>[]>(() => [
  {
    accessorKey: 'stt',
    header: 'STT',
    cell: ({ row }) => row.index + 1
  },
  {
    key: 'movie',
    header: t('movie'),
    cell: () => movieDetail.value.name
  },
  {
    key: 'cinema',
    header: t('cinema'),
    cell: ({ row }) =>
      h('div', { class: 'space-y-1' }, [
        h('p', { class: 'font-medium' }, row.original.cinemaName),
        h(
          'p',
          { class: 'text-xs text-gray-500' },
          `${row.original.province} - ${row.original.commune} - ${row.original.detailAddress}`
        )
      ])
  },
  {
    key: 'room',
    header: t('room'),
    cell: ({ row }) => row.original.name
  },
  {
    key: 'date',
    header: t('day'),
    cell: ({ row }) => row.original.date.replace(/:/g, '-')
  },
  {
    key: 'startTime',
    header: t('start-time'),
    cell: ({ row }) => row.original.startTime
  },
  {
    id: 'action',
    header: ''
  }
])

function getDropdownActions(row: IShowtimeTable): DropdownMenuItem[][] {
  return [
    [
      {
        label: t('edit'),
        icon: 'i-lucide-edit',
        onSelect: () => {
          showTimeDetail.value = row
          movieShowtimeSetting.value = row
          emit('edit')
        }
      },
      {
        label: isDeleting.value ? t('deleting') + '...' : t('delete'),
        icon: isDeleting.value ? 'i-lucide-loader spin' : 'i-lucide-trash',
        color: 'error',
        disabled: isDeleting.value,
        onSelect: async () => {
          showTimeDetail.value = row
          movieShowtimeSetting.value = row
          isConfirmOpen.value = true
        }
      }
    ]
  ]
}

const handleDelete = async () => {
  if (!showTimeDetail.value.id) return
  isDeleting.value = true
  try {
    const { message } = await apiShowtime.deleteShowtime(showTimeDetail.value.id)
    toast.add({
      title: t('success'),
      description: message,
      color: 'success'
    })
    isConfirmOpen.value = false
    await fetchShowtimes()
  } catch (error) {
    console.log(error)
  } finally {
    isDeleting.value = false
    showTimeDetail.value = {} as IShowtimeTable
  }
}

const handleClose = () => {
  localStorage.clear()
}
defineExpose({
  fetchShowtimes
})
</script>
<template>
  <UModal v-model:open="isOpen" :title="t('movie-detail')" @close:prevent="handleClose">
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
        <UTable ref="table" :data="data" :columns="columns" :loading="pending">
          <template #action-cell="{ row }">
            <UDropdownMenu :items="getDropdownActions(row.original)" :ui="{ itemLabel: 'cursor-pointer' }">
              <UButton
                icon="i-lucide-ellipsis-vertical"
                color="neutral"
                variant="ghost"
                aria-label="Actions"
                class="hover:cursor-pointer"
              />
            </UDropdownMenu>
          </template>
        </UTable>
      </div>
    </template>
  </UModal>
  <BaseConfirmModal
    v-model:open="isConfirmOpen"
    variant="danger"
    :title="t('delete-showtime-title')"
    :description="
      formatConfirmContent(t('delete-showtime-confirm', { time: `${showTimeDetail.startTime}` }), showTimeDetail.startTime)
    "
    :confirm-text="t('delete')"
    :cancel-text="t('cancel-button')"
    :is-loading="isDeleting"
    @confirm="handleDelete"
  />
</template>

<style scoped></style>
