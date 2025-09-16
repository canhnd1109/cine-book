<script setup lang="ts">
const { t } = useI18n()
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'CineBook – Đặt Vé Xem Phim Trực Tuyến Nhanh Chóng & Tiện Lợi'
const description = t('app.description')

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description

})
</script>

<template>
  <UApp>
    <AppHeader />
    <NuxtPage />
    <AppFooter />
  </UApp>
</template>
<!-- https://www.mindinventory.com/portfolio/movie-ticket-booking-app/?utm_source=chatgpt.com -->
