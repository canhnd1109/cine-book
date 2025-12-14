<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'

interface Props {
  title: string
  fromDateLabel: string
  toDateLabel: string
  fromDate: string
  toDate: string
  chartOptions: ApexOptions
  series: any[]
  loading: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:fromDate': [value: string]
  'update:toDate': [value: string]
  focusFromDate: []
  focusToDate: []
}>()

const fromDateRef = ref<{ $el?: HTMLElement } | null>(null)
const toDateRef = ref<{ $el?: HTMLElement } | null>(null)

const handleFocusFromDate = () => {
  focusDateInput(fromDateRef)
  emit('focusFromDate')
}

const handleFocusToDate = () => {
  focusDateInput(toDateRef)
  emit('focusToDate')
}
</script>

<template>
  <div class="dark:bg-bg-seconary-dark bg-white rounded-xl p-6 space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">{{ title }}</h2>
    </div>

    <!-- Filters -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="space-y-2">
        <label class="text-sm font-medium">{{ fromDateLabel }}</label>
        <UInput
          ref="fromDateRef"
          :model-value="fromDate"
          type="date"
          :ui="{ base: 'h-10', root: 'w-full' }"
          @update:model-value="emit('update:fromDate', $event)"
          @click="handleFocusFromDate"
        />
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium">{{ toDateLabel }}</label>
        <UInput
          ref="toDateRef"
          :model-value="toDate"
          type="date"
          :ui="{ base: 'h-10', root: 'w-full' }"
          @update:model-value="emit('update:toDate', $event)"
          @click="handleFocusToDate"
        />
      </div>
    </div>

    <!-- Chart -->
    <BaseChart type="area" :options="chartOptions" :series="series" :loading="loading" height="360" />
  </div>
</template>
