<script setup lang="ts">
import { createShowtimeSchema, type ICreateShowtime } from '~/schemas/movie.chema'

const { t } = useI18n()
const { schema } = useSchema(createShowtimeSchema)
const { allCinemas, roomsOfCinema, fetchRoomsOfCinema } = useCinemaData()
const { movieDetail } = useMovieData()

const { isProcessing = false } = defineProps<{
  isProcessing?: boolean
}>()

const loadingRooms = ref(false)
const isOpen = defineModel<boolean>({
  required: true,
  default: false
})

const initialFormState: ICreateShowtime = {
  cinemaId: '',
  roomId: '',
  movieId: movieDetail.value.id,
  startTime: '',
  endTime: ''
}
watch(
  () => isOpen.value,
  newValue => {
    if (newValue && movieDetail.value?.id) {
      form.value.movieId = movieDetail.value.id
    }
  }
)

const form = ref<ICreateShowtime>({ ...initialFormState })

const emit = defineEmits<{
  setting: [form: ICreateShowtime]
}>()

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

const canSubmit = computed(() => {
  return form.value.movieId && form.value.roomId && form.value.startTime
})

const formRef = ref()

const resetForm = () => {
  form.value = { ...initialFormState }
  formRef.value?.clear()
}

const submitForm = () => {
  if (formRef.value) {
    formRef.value.submit()
  }
}

defineExpose({
  resetForm
})
</script>

<template>
  <UModal v-model:open="isOpen" :title="t('setting-movie')" class="!w-[800px]" @close:prevent="resetForm">
    <template #body>
      <UForm ref="formRef" :schema :state="form" class="space-y-4" @submit="emit('setting', form)">
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
    <template #footer>
      <div class="flex justify-end w-full">
        <BaseButton
          :text="t('setting')"
          class="w-26"
          variant="solid"
          class-name="rounded "
          :is-disable="!canSubmit"
          :is-loading="isProcessing"
          @click="submitForm"
        />
      </div>
    </template>
  </UModal>
</template>

<style scoped></style>
