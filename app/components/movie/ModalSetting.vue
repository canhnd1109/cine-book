<script setup lang="ts">
import { createShowtimeSchema, type ICreateShowtime } from '~/schemas/movie.chema'

const { t } = useI18n()
const { schema } = useSchema(createShowtimeSchema)
const { allCinemas, roomsOfCinema, fetchRoomsOfCinema } = useCinemaData()
const { movieDetail } = useMovieData()

const loadingRooms = ref(false)
const isOpen = defineModel<boolean>({
  required: true,
  default: false
})

const form = ref<ICreateShowtime>({
  cinemaId: '',
  roomId: '',
  movieId: '',
  startTime: '',
  endTime: ''
})

const cinemaOptions = computed(() => {
  return allCinemas.value.map(cinema => ({
    ...cinema,
    label: `${cinema.name} (${cinema.province} - ${cinema.commune} - ${cinema.detailAddress})`
  }))
})

watch(
  () => form.value.cinemaId,
  async newCinemaId => {
    form.value.roomId = ''

    if (newCinemaId) {
      loadingRooms.value = true
      try {
        await fetchRoomsOfCinema(newCinemaId)
      } catch (error) {
        console.error(error)
      } finally {
        loadingRooms.value = false
      }
    }
  }
)

watch(
  () => [form.value.startTime, movieDetail.value?.duration],
  ([startTime, duration]) => {
    if (startTime && duration) {
      const startDate = new Date(startTime)
      const totalMinutes = Number(duration) + 30
      const endDate = new Date(startDate.getTime() + totalMinutes * 60 * 1000)

      const year = endDate.getFullYear()
      const month = String(endDate.getMonth() + 1).padStart(2, '0')
      const day = String(endDate.getDate()).padStart(2, '0')
      const hours = String(endDate.getHours()).padStart(2, '0')
      const minutes = String(endDate.getMinutes()).padStart(2, '0')

      form.value.endTime = `${year}-${month}-${day}T${hours}:${minutes}`
    }
  }
)

const startTime = ref<{ $el?: HTMLElement } | null>(null)
const focusStartTimeInput = () => {
  focusDateInput(startTime)
}
</script>

<template>
  <UModal v-model:open="isOpen" :title="t('setting-movie')" class="!w-[800px]">
    <template #body>
      <UForm ref="formRef" :schema :state="form" class="space-y-4">
        <div class="grid grid-cols-2 gap-6">
          <UFormField :label="t('cinema')" name="cinemaId">
            <BaseSelectMenu
              v-model="form.cinemaId"
              :items="cinemaOptions"
              label-key="label"
              value-key="id"
              :placeholder="t('select-cinema')"
              class="w-full"
            />
          </UFormField>
          <UFormField :label="t('room')" name="roomId">
            <BaseSelectMenu
              v-model="form.roomId"
              :items="roomsOfCinema"
              label-key="name"
              value-key="roomId"
              :placeholder="t('select-room')"
              :disabled="loadingRooms || !form.cinemaId"
              class="w-full"
            />
          </UFormField>
          <UFormField :label="t('start-time-show')" name="startTime">
            <UInput
              ref="startTime"
              v-model="form.startTime"
              type="datetime-local"
              :placeholder="t('choose-start-time')"
              :ui="{ base: 'h-10', root: 'w-full' }"
              class="w-full"
              @click="focusStartTimeInput"
            />
          </UFormField>
          <UFormField :label="t('end-time-show')" name="endTime">
            <UInput
              v-model="form.endTime"
              type="datetime-local"
              :placeholder="t('choose-end-time')"
              :ui="{ base: 'h-10', root: 'w-full' }"
              class="w-full"
              disabled
            />
          </UFormField>
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<style scoped></style>
