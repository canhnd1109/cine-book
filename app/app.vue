<script setup lang="ts">
const appConfig = useAppConfig()
const { t } = useI18n()

useHead({
  title: 'CineBook – Đặt Vé Xem Phim Trực Tuyến Nhanh Chóng & Tiện Lợi',
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

useSeoMeta({
  title: appConfig.title,
  description: t(`${appConfig.description}`),
  ogTitle: appConfig.title,
  ogDescription: t(`${appConfig.description}`)
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage keep-alive />
    </NuxtLayout>
  </UApp>
</template>
<!-- https://www.mindinventory.com/portfolio/movie-ticket-booking-app/?utm_source=chatgpt.com -->
<!-- https://chieuphimquocgia.com.vn/ -->
