<script setup lang="ts">
import useFormatDate from '~/composables/useDateFormat'
import { apiPublic } from '~/services'

const { movieDetail } = useMovieData()
const route = useRoute()

const {
  data,
  pending: _isFetching,
  refresh: _refresh
} = await useAsyncData('room-detail', async () => {
  const res = await apiPublic.getMovieDetail(route.params.id as string)
  return res.value
})

watchEffect(() => {
  if (data.value) {
    movieDetail.value = data.value
  }
})

const isValidTrailerUrl = computed(() => {
  const url = movieDetail.value?.trailerUrl
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return false
  }
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
})

const embedUrl = computed(() => {
  const url = movieDetail.value?.trailerUrl
  if (!url || typeof url !== 'string') return ''

  try {
    const urlObj = new URL(url)

    // Check if it's a YouTube URL
    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      let videoId = ''

      // Handle different YouTube URL formats
      if (urlObj.hostname.includes('youtube.com')) {
        if (urlObj.pathname.includes('/embed/')) {
          // Already in embed format
          return url
        } else if (urlObj.pathname.includes('/watch')) {
          // https://www.youtube.com/watch?v=VIDEO_ID
          videoId = urlObj.searchParams.get('v') || ''
        } else if (urlObj.pathname.includes('/shorts/')) {
          // https://www.youtube.com/shorts/VIDEO_ID
          videoId = urlObj.pathname.split('/shorts/')[1] || ''
        }
      } else if (urlObj.hostname.includes('youtu.be')) {
        // https://youtu.be/VIDEO_ID
        videoId = urlObj.pathname.slice(1)
      }

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`
      }
    }

    return url
  } catch {
    return url
  }
})
</script>
<template>
  <div>
    <div class="max-w-4xl mx-auto flex justify-start gap-10">
      <img :src="movieDetail.posterUrl" alt="" class="h-[333px] w-[238px] rounded-lg" loading="lazy" />
      <div class="flex-1 space-y-1">
        <p class="text-2xl font-bold">{{ movieDetail.name }}</p>
        <p class="flex justify-between items-center">
          <span>{{ movieDetail.genres.join(',') }}</span>
          <span>{{ minutesToHours(movieDetail.duration) }}</span>
          <span>{{ movieDetail.nation }}</span>
        </p>
        <p>Đạo diễn: {{ movieDetail.director }}</p>
        <p>Diễn viên: {{ movieDetail.performer }}</p>
        <p>Thời gian khởi chiếu: {{ useFormatDate(movieDetail.releaseDate, 'DD/MM/YYYY hh:mm:ss') }}</p>
        <p>Thời gian kết thúc: {{ useFormatDate(movieDetail.releaseDate, 'DD/MM/YYYY hh:mm:ss') }}</p>
        <p class="text-red-500">{{ movieDetail.note }}</p>
        <p class="mt-6">{{ movieDetail.description }}</p>
      </div>
    </div>
    <div
      v-if="isValidTrailerUrl"
      class="w-full max-w-4xl mx-auto my-6 overflow-hidden rounded-2xl shadow-lg"
      style="aspect-ratio: 16/9"
    >
      <iframe
        :src="embedUrl"
        class="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        loading="lazy"
      />
    </div>
  </div>
</template>

<style scoped></style>
