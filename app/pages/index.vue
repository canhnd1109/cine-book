<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import useFormatDate from '~/composables/useDateFormat'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
import { apiPublic } from '~/services'
import type { IMovieFilter } from '~/types/movie.type'

const { t } = useI18n()
const { top10MostViewedMovies } = useMovieData()

const items = [
  '/images/phim-9.png',
  '/images/phim-8.png',
  '/images/phim-7.png',
  '/images/phim-6.png',
  '/images/phim-5.png',
  '/images/phim-4.png',
  '/images/phim-3.png',
  '/images/phim-2.png',
  '/images/phim-1.png'
]
const imagesList = [
  '/images/img-1.png',
  '/images/img-2.png',
  '/images/img-3.png',
  '/images/img-4.png',
  '/images/img-5.png',
  '/images/img-6.png',
  '/images/img-7.png',
  '/images/img-8.png'
]

const { data, pending: isFetching } = await useAsyncData('top-10-most-viewed-movies', async () => {
  const res = await apiPublic.fetchMovies({ orderBy: '4' } as IMovieFilter)
  return res.value
})

watchEffect(() => {
  top10MostViewedMovies.value = data.value?.content || []
})
</script>

<template>
  <div>
    <Swiper
      :modules="[Autoplay, EffectFade, Pagination]"
      :loop="true"
      :speed="1000"
      :autoplay="{ delay: 3000, disableOnInteraction: false }"
      effect="fade"
      :fade-effect="{ crossFade: true }"
      :auto-height="true"
      :pagination="{ clickable: true }"
    >
      <SwiperSlide v-for="(img, idx) in items" :key="idx">
        <img :src="img" class="w-full h-auto mx-auto" />
      </SwiperSlide>
    </Swiper>

    <div class="mx-12 mt-6">
      <p class="text-3xl font-bold">Top 10 bộ phim có lượt xem nhiều nhất</p>
      {{ top10MostViewedMovies.length }}
      <UCarousel
        v-if="top10MostViewedMovies.length"
        v-slot="{ item, index }"
        :items="top10MostViewedMovies"
        :ui="{ item: 'basis-1/6' }"
        class="mt-6"
      >
        <div class="cursor-pointer" :class="index !== 0 ? 'ps-8' : ''">
          <img
            :src="item.posterUrl"
            class="object-cover image max-sm:object-center image h-[445px] hover:scale-102 transition duration-500"
            :class="index % 2 === 0 ? 'clip-shape-right' : 'clip-shape-left'"
          />
          <p class="flex justify-between items-center text-[#999] mt-2">
            <span>{{ item.genres.join(',') }}</span>
            <span>{{ useFormatDate(item.releaseDate, 'DD/MM/YYYY') }}</span>
          </p>
          <p class="flex justify-between items-center">
            <span class="text-xl font-bold">{{ item.name }}</span>
            <span>{{ minutesToHours(item.duration) }}</span>
          </p>
        </div>
      </UCarousel>
      <BaseEmpty v-else />
    </div>

    <div class="dark:bg-[#111] bg-bg-light rounded-[50px] py-24 mx-12 my-6">
      <div class="px-10 space-y-10">
        <div class="title-wrap bookmb-15 text-center">
          <p class="small-title bookfont-100 text-center">
            {{ t('home.content-1') }}
          </p>
          <p class="title-bg bookfont-100 text-center">
            {{ t('home.content-1') }}
          </p>
        </div>
        <div class="text-center w-full flex justify-center">
          <p class="text-center text-[#999] text-2xl w-1/2">
            {{ t('home.content-2') }}
          </p>
        </div>
      </div>

      <div class="marquee-wrapper bookmt-90 w-full">
        <div class="marquee-inner w-full">
          <div class="common-slider w-full">
            <div class="marquee-items">
              <div v-for="n in 2" :key="n" class="flex">
                <div v-for="(item, index) in imagesList" :key="index" class="item">
                  <div class="img-wrap">
                    <img
                      :src="item"
                      width="220"
                      height="220"
                      loading="lazy"
                      alt="movie"
                      class="img-fluid hover:scale-105 duration-500 cursor-pointer transition"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.marquee-wrapper {
  overflow: hidden;
  width: 100%;
  line-height: 0;
}

.bookmt-90 {
  margin-top: 90px;
}

.marquee-inner {
  display: flex;
  align-items: center;
  white-space: nowrap;
  width: 100%;
  background: url(/images/ticket-slider-bg.png) no-repeat;
  height: 310px;
  background-size: cover;
}

.common-slider {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
}

/* Chạy liên tục */
.marquee-items {
  display: flex;
  flex-wrap: nowrap;
  animation: moviemarqueeLeft 60s linear infinite;
}

.item {
  width: 220px;
  height: 220px;
  margin: 0 10px;
  flex-shrink: 0;
}

.item .img-wrap img {
  width: 220px;
  aspect-ratio: 1;
  border-radius: 6px;
  filter: grayscale(100%);
  transition: filter 0.3s;
}

.item .img-wrap img:hover {
  filter: grayscale(0%);
}

.img-fluid {
  max-width: 100%;
  height: auto;
}

.marquee-items .item:hover .img-wrap img {
  filter: none;
}
.title-wrap {
  position: relative;
  display: inline-block;
}

.title-wrap {
  position: relative;
  display: inline-block;
}

.title-wrap .small-title {
  font-weight: 900;
  text-transform: uppercase;
  background: linear-gradient(90deg, #f3dd68, #ffef9b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  z-index: 2;
  display: inline-block;
  word-break: break-word;
}

.bookfont-100 {
  font-size: 3.208vw;
  line-height: 4.677vw;
}

.title-wrap .title-bg {
  font-weight: 900;
  text-transform: uppercase;
  background: linear-gradient(90deg, #f3dd68, #ffef9b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: #111;
  -webkit-text-stroke: 1px #111;
  opacity: 0.5;
  position: absolute;
  top: 5px;
  left: 5px;
  right: 0;
  margin: 0 auto;
  z-index: 1;
}

@keyframes moviemarqueeLeft {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
