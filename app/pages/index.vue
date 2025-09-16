<template>
  <div>
    <UCarousel
      v-slot="{ item }"
      dots
      autoplay
      loop
      :auto-height="true"
      :items="items"
      :ui="{
        dots: '!bottom-0 !-mt-32',
        dot: '!bottom-0 !-mt-32'
      }"
    >
      <img
        :src="item"
        class="w-full h-auto mx-auto"
      >
    </UCarousel>
    <div class="marquee-wrapper bookmt-90 w-full">
      <div class="marquee-inner w-full">
        <div class="common-slider w-full">
          <div class="marquee-items">
            <div
              v-for="n in 2"
              :key="n"
              class="flex"
            >
              <div
                v-for="(item, index) in imagesList"
                :key="index"
                class="item"
              >
                <div class="img-wrap">
                  <img
                    :src="item"
                    width="220"
                    height="220"
                    loading="lazy"
                    alt="movie"
                    class="img-fluid"
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// const { t } = useI18n()
const items = [
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

<style scoped>
.marquee-wrapper {
  overflow: hidden;
  width: 100%;
  line-height: 0;
}

.bookmyticket-wrapper .bookmt-90 {
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

@keyframes moviemarqueeLeft {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
