<script setup lang="ts">
import useFormatDate from '~/composables/useDateFormat'

const { t } = useI18n()
const isOpen = defineModel('isOpen', { type: Boolean, default: false })
const { movieDetail } = useMovieData()
</script>
<template>
  <UModal v-model:open="isOpen" :title="t('movie-detail')" class="w-[800px]">
    <template #body>
      <img :src="movieDetail.posterUrl" :alt="movieDetail.name" class="w-96 h-64 mx-auto rounded-lg shadow-md object-cover" />
      <p class="mt-2 line-clamp-2 text-center font-medium">
        {{ movieDetail.name }}
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
      <p class="flex justify-start items-center gap-2">
        <span class="text-[#90a1b9] text-sm">{{ $t('note') }}: </span>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span class="text-text-error line-clamp-3" v-html="movieDetail.note" />
      </p>
      <p>
        <span class="text-[#90a1b9] text-sm">{{ $t('price-ticket') }}: </span>
        <span>{{ formatPrice(movieDetail.price) }}</span>
      </p>
      <p>
        <span class="text-[#90a1b9] text-sm">{{ $t('genres') }}: </span>
        <span>{{ movieDetail.genres.join(', ') }}</span>
      </p>

      <!-- eslint-disable-next-line vue/no-v-html -->
      <p class="line-clamp-3" v-html="movieDetail.description" />
    </template>
  </UModal>
</template>

<style scoped></style>
