<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'

const { t } = useI18n()
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

    <div class="dark:bg-[#111] bg-light-bg rounded-[50px] py-24 mx-12 my-6">
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
