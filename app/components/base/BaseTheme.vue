<script setup>
const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(_isDark) {
    colorMode.preference = _isDark ? 'dark' : 'light'
  }
})
</script>

<template>
  <UButton
    :icon="isDark ? 'i-lucide-sun' :'i-lucide-moon'"
    color="neutral"
    variant="ghost"
    :ui="{ base: 'cursor-pointer' }"
    @click="isDark = !isDark"
  />
</template>
