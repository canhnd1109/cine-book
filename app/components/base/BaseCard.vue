<script setup lang="ts" generic="T extends Record<string, any>">
import type { IActionCard } from '~/types/constant.type'

const { t } = useI18n()

interface Props {
  item: T
  index?: number
  showActions?: boolean
  animationDelay?: number
  canScale?: boolean
  showBorder?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  index: 0,
  showActions: true,
  animationDelay: 200,
  canScale: true,
  showBorder: false
})

const emit = defineEmits<{
  'action-click': [action: IActionCard, item: T]
}>()

const delay = computed(() => `${props.index * props.animationDelay}ms`)

const handleActionClick = (action: IActionCard) => {
  emit('action-click', action, props.item)
}
</script>

<template>
  <div
    class="card fade-in transform cursor-pointer rounded-lg p-4 transition duration-500 border border-solid border-border-light dark:border-border-dark"
    :style="{ animationDelay: delay }"
    :class="{ 'hover:scale-105': canScale, 'hover:border-primary': showBorder }"
  >
    <div>
      <slot name="image" />

      <slot name="content" />
    </div>

    <div v-if="showActions" class="action-buttons-wrapper dark:bg-[#0f172a] bg-white flex items-center justify-center space-x-2">
      <!-- <template #actions="{ item, onAction }"> -->
      <slot name="actions" :item="item" :on-action="handleActionClick">
        <UTooltip :text="t('edit')" :delay-duration="0">
          <UButton class="hover:cursor-pointer" icon="i-lucide-edit" size="sm" variant="ghost" @click="handleActionClick('EDIT')"
        /></UTooltip>
        <UTooltip :text="t('settings')" :delay-duration="0">
          <UButton
            class="hover:cursor-pointer"
            icon="i-lucide-settings"
            size="sm"
            variant="ghost"
            @click="handleActionClick('SETTING')"
        /></UTooltip>
        <UTooltip :text="t('view')" :delay-duration="0">
          <UButton
            class="hover:cursor-pointer"
            icon="i-lucide-eye"
            size="sm"
            variant="ghost"
            @click="handleActionClick('VIEW')"
          />
        </UTooltip>
        <UTooltip :text="t('delete')" :delay-duration="0">
          <UButton
            class="hover:cursor-pointer"
            icon="i-lucide-trash"
            size="sm"
            variant="ghost"
            @click="handleActionClick('DELETE')"
          />
        </UTooltip>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.4s ease;
}

.fade-in {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  position: relative;
  overflow: hidden;
}

.action-buttons-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.card:hover .action-buttons-wrapper {
  transform: translateY(0);
}
</style>
