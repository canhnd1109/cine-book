<script setup lang="ts">
import type { IFormState } from '~/types/cinema.type'

const { filters, apply } = useCinemaData()
const { getProvinces } = useLocation()
const { t } = useI18n()

const { data: provinces, pending: loadingProvinces } = getProvinces()

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
</script>

<template>
  <div class="flex justify-between items-center">
    <div class="flex gap-3">
      <BaseInput
        v-model="filters.keyWord"
        :is-show-clear="true"
        base-style="w-68"
        @input="apply({ keyWord: filters.keyWord }, { debounce: true, resetPage: true })"
      />
      <BaseSelectMenu
        v-model="provinceModel"
        :items="provinceOptions"
        label-key="label"
        value-key="value"
        :placeholder="t('select-province')"
        :disabled="loadingProvinces"
        class="w-60"
      />
    </div>
    <BaseButton :text="t('add')" variant="solid" class-name="rounded" @click="emits('add', true, {} as IFormState)" />
  </div>
</template>

<style scoped></style>
