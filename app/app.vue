<script setup>
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

const title = 'Nuxt Changelog Template'
const description = 'Display GitHub release notes as a beautiful changelog for any repository with this Nuxt UI template.'

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
  </UApp>
</template>
