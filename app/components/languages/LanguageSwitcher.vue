<template>
  <USelect
    v-model="locale"
    :items="items"
    value-key="value"
    :avatar="avatar"
    :ui="{
      base: 'w-36 h-10 hover:cursor-pointer',
      value: 'ml-2 hover:cursor-pointer',
      content: 'hover:cursor-pointer'
    }"
    @change="setLocale(locale)"
  />
</template>

<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui'

const { locale, setLocale } = useI18n()

const items = ref([
  {
    label: 'English',
    value: 'en',
    avatar: {
      src: 'https://res.cloudinary.com/dbjqbfjfr/image/upload/v1758096672/uploads/mzqqfyga3v5qg0gy78z8.png',
      alt: 'English',
      size: 'xs'
    }
  },
  {
    label: 'Việt Nam',
    value: 'vi',
    avatar: {
      src: 'https://res.cloudinary.com/dbjqbfjfr/image/upload/v1758096672/uploads/orjvqbo00gr2dbct47hg.png',
      alt: 'Việt Nam',
      size: 'xs'
    }
  }
] satisfies SelectItem[])

const avatar = computed(() =>
  items.value.find(item => item.value === locale.value)?.avatar
)
</script>
