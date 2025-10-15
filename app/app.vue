<script setup lang="ts">
const appConfig = useAppConfig()

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', type: 'image/png', href: '/images/favicon.png' }],
  htmlAttrs: { lang: 'en' }
})

useSeoMeta({
  title: appConfig.title,
  description: appConfig.description,
  ogTitle: appConfig.title,
  ogDescription: appConfig.description,
  ogImage: 'https://ui4.nuxt.com/assets/templates/nuxt/changelog-light.png',
  twitterImage: 'https://ui4.nuxt.com/assets/templates/nuxt/changelog-light.png',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage keep-alive />
    </NuxtLayout>
  </UApp>
</template>
