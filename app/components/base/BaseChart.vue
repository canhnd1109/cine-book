<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts'
import type { ApexOptions } from 'apexcharts'

interface Props {
  series: any[]
  options?: ApexOptions
  type?: 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'radialBar' | 'scatter' | 'bubble' | 'heatmap' | 'candlestick'
  height?: string | number
  loading?: boolean
  emptyText?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'line',
  height: 350,
  loading: false,
  emptyText: 'No data available'
})

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const hasData = computed(() => props.series && props.series.length > 0)

const defaultOptions: ApexOptions = {
  chart: {
    type: props.type,
    background: isDark.value ? '#0f172a' : '#ffffff',
    toolbar: {
      show: true
    }
  },
  theme: {
    mode: isDark.value ? 'dark' : 'light'
  },
  grid: {
    borderColor: isDark.value ? '#374151' : '#e5e7eb',
    strokeDashArray: 4
  },
  xaxis: {
    labels: {
      style: {
        colors: isDark.value ? '#9ca3af' : '#6b7280'
      }
    }
  },
  yaxis: {
    labels: {
      style: {
        colors: isDark.value ? '#9ca3af' : '#6b7280'
      }
    }
  },
  legend: {
    labels: {
      colors: isDark.value ? '#d1d5db' : '#374151'
    }
  },
  tooltip: {
    theme: isDark.value ? 'dark' : 'light'
  }
}

const mergedOptions = computed<ApexOptions>(() => {
  const merged = {
    ...defaultOptions,
    ...props.options
  }

  // Merge nested objects properly
  if (props.options?.chart) {
    merged.chart = {
      ...defaultOptions.chart,
      ...props.options.chart,
      background: isDark.value ? '#0f172a' : '#ffffff'
    }
  }

  if (props.options?.theme) {
    merged.theme = {
      ...defaultOptions.theme,
      ...props.options.theme,
      mode: isDark.value ? 'dark' : 'light'
    }
  }

  if (props.options?.grid) {
    merged.grid = {
      ...defaultOptions.grid,
      ...props.options.grid,
      borderColor: isDark.value ? '#374151' : '#e5e7eb'
    }
  }

  return merged
})

const chartKey = computed(() => `chart-${props.type}-${props.series.length}-${isDark.value}`)
</script>

<template>
  <div class="w-full">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>

    <!-- Chart -->
    <div v-else-if="!loading && hasData" class="w-full rounded-lg overflow-hidden">
      <ClientOnly>
        <VueApexCharts :key="chartKey" :type="type" :options="mergedOptions" :series="series" :height="height" />
      </ClientOnly>
    </div>

    <!-- Empty State -->
    <BaseEmpty v-else />
  </div>
</template>

<style scoped></style>
