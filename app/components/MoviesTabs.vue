<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
const route = useRoute()
const router = useRouter()

const items = ref<TabsItem[]>([
  { label: 'Movies', value: 'movies' },
  { label: 'Genre', value: 'genre' }
])

const active = computed<string>({
  get() {
    if (route.name === 'admin-movies') return 'movies'
    if (route.name === 'admin-movies-genre') return 'genre'
    return 'movies'
  },
  set(tab: string) {
    if (tab === 'movies') router.push({ name: 'admin-movies' })
    else router.push({ name: 'admin-movies-genre' })
  }
})
</script>

<template>
  <UTabs
    v-model="active"
    color="neutral"
    :content="false"
    :items="items"
    variant="link"
    :ui="{ trigger: 'hover:cursor-pointer' }"
  />
</template>
