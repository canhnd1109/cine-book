<script setup lang="ts">
import type { IFormState } from '~/types/cinema.type'

const { filters, apply, resetFilter } = useCinemaData()
const { getProvinces } = useLocation()
const { t } = useI18n()

const { data: provinces } = getProvinces()

const emits = defineEmits<{
  search: []
  add: [value: boolean, form: IFormState]
}>()

const provinceOptions = computed(() => {
  if (!provinces.value) return []
  return provinces.value.map(p => ({
    label: p.name,
    value: p.code,
    ...p
  }))
})
const selectedProvinceName = computed(() => {
  return (
    provinceOptions.value.find((p: { label: string; value: number }) => p.value === Number(filters.value.province))?.label || ''
  )
})
</script>

<template>
  <div class="flex justify-between items-center">
    <div class="flex gap-3 items-center">
      <BaseInput
        v-model="filters.keyWord"
        :is-show-clear="true"
        base-style="w-68"
        @input="apply({ keyWord: filters.keyWord }, { debounce: true, resetPage: true })"
      />
      <BaseSelectMenu
        v-model="filters.province"
        :items="provinceOptions"
        label-key="label"
        value-key="value"
        :placeholder="t('select-province')"
        class="w-60"
        @change="apply({ province: selectedProvinceName as typeof filters.province }, { resetPage: true })"
      />

      <UTooltip :text="t('reset-filter')" :delay-duration="0">
        <UIcon name="i-lucide-rotate-ccw" class="size-5 hover:cursor-pointer" @click="resetFilter" />
      </UTooltip>
    </div>
    <BaseButton :text="t('add')" variant="solid" class-name="rounded" @click="emits('add', true, {} as IFormState)" />
  </div>
</template>

<style scoped></style>
