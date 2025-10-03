<script setup lang="ts">
const emits = defineEmits<{
  search: []
  add: [value: boolean]
}>()
const search = defineModel<string>('search', { default: '' })
const { t } = useI18n()
const doSearch = () => {
  console.log('Search triggered:', search.value)
}
</script>

<template>
  <div class="flex justify-between items-center">
    <BaseInput v-model="search" @search="doSearch" />
    <BaseButton :text="t('add')" variant="solid" class-name="rounded" @click="emits('add', true)" />
  </div>
</template>

<style scoped></style>
