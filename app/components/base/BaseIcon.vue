<script setup lang="ts">
interface Props {
  name?: string
  size?: number | string
}

const { size = 24, name = 'loading' } = defineProps<Props>()

const emit = defineEmits<{ click: [] }>()

const iconStyles = computed(() => {
  return {
    fontSize: `${size}px`,
    width: `${size}px`,
    height: `${size}px`
  }
})

const icons = import.meta.glob<Component>('@/assets/icons/*.svg', { eager: true })

const iconComponent = computed<Component | null>(() => {
  const key = `/assets/icons/${name}.svg`
  const mod = icons[key] as { default: Component } | undefined
  return mod?.default || null
})
</script>

<template>
  <component :is="iconComponent" v-if="iconComponent" class="base-icon" :style="iconStyles" @click="emit('click')" />
</template>

<style scoped></style>
