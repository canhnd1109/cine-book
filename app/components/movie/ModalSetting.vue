<script setup lang="ts">
import { createShowtimeSchema, type ICreateShowtime } from '~/schemas/movie.chema'

const { t } = useI18n()
const { schema } = useSchema(createShowtimeSchema)

const isOpen = defineModel<boolean>({
  required: true,
  default: false
})

const form = ref<ICreateShowtime>({
  roomId: '',
  movieId: '',
  startTime: '',
  endTime: ''
})
</script>
<template>
  <UModal v-model:open="isOpen" :title="t('setting-movie')" class="!w-[800px]">
    <template #body>
      <UForm ref="formRef" :schema :state="form" class="space-y-4">
        <UFormField class="flex justify-center items-center" name="posterFile" />
      </UForm>
    </template>
  </UModal>
</template>

<style scoped></style>
