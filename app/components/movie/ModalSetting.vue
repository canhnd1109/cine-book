<script setup lang="ts">
import { createShowtimeSchema, type ICreateShowtime } from '~/schemas/movie.chema'

const { t } = useI18n()
const { schema } = useSchema(createShowtimeSchema)
const { allCinemas, roomsOfCinema, fetchRoomsOfCinema } = useCinemaData()

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
    console.log('🚀 ~ newCinemaId:', newCinemaId)
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
</script>
<template>
  <UModal v-model:open="isOpen" :title="t('setting-movie')" class="!w-[800px]">
    <template #body>
      <UForm ref="formRef" :schema :state="form" class="space-y-4">
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
      </UForm>
    </template>
  </UModal>
</template>

<style scoped></style>
