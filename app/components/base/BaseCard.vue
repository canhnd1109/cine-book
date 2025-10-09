<script setup lang="ts" generic="T extends Record<string, any>">
interface Props {
  item: T
  index?: number
  showActions?: boolean
  animationDelay?: number
}

const props = withDefaults(defineProps<Props>(), {
  index: 0,
  showActions: true,
  animationDelay: 200
})

const emit = defineEmits<{
  'action-click': [action: string, item: T]
}>()

const delay = computed(() => `${props.index * props.animationDelay}ms`)

const handleActionClick = (action: string) => {
  emit('action-click', action, props.item)
}
</script>

<template>
  <div
    class="card fade-in transform cursor-pointer rounded-lg p-4 transition duration-500 hover:scale-105 border border-solid border-border-light dark:border-border-dark"
    :style="{ animationDelay: delay }"
  >
    <div>
      <slot name="image" />

      <slot name="content" />
    </div>

    <div v-if="showActions" class="action-buttons-wrapper dark:bg-[#0f172a] bg-white flex items-center justify-center space-x-2">
      <slot name="actions" :item="item" :on-action="handleActionClick">
        <UButton class="hover:cursor-pointer" icon="i-lucide-edit" size="sm" variant="ghost" @click="handleActionClick('edit')" />
        <UButton class="hover:cursor-pointer" icon="i-lucide-eye" size="sm" variant="ghost" @click="handleActionClick('view')" />
        <UButton
          class="hover:cursor-pointer"
          icon="i-lucide-trash"
          size="sm"
          variant="ghost"
          @click="handleActionClick('delete')"
        />
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
