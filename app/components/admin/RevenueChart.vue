<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts'
import type { ApexOptions } from 'apexcharts'
import { apiReport } from '~/services'
import type { IRevenueReportParams, IRevenueReport } from '~/types/statistics.type'

const { t } = useI18n()
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const groupTypeOptions = [
  { label: t('by-day'), value: 1 },
  { label: t('by-week'), value: 2 },
  { label: t('by-month'), value: 3 },
  { label: t('by-year'), value: 4 }
]
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000
const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000

const getDefaultGroupType = (fromDate: string, toDate: string): number => {
  const from = new Date(fromDate).getTime()
  const to = new Date(toDate).getTime()
  const diff = to - from

  if (diff > ONE_YEAR_MS) return 4 // By year
  if (diff > ONE_MONTH_MS) return 3 // By month
  if (diff > ONE_WEEK_MS) return 2 // By week
  return 1 // By day
}

const defaultFromDate = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0] || ''
const defaultToDate = new Date().toISOString().split('T')[0] || ''

const filters = ref<IRevenueReportParams>({
  fromDate: defaultFromDate,
  toDate: defaultToDate,
  groupType: getDefaultGroupType(defaultFromDate, defaultToDate)
})

const { data, pending, execute } = await useLazyAsyncData(
  'revenue-report',
  async () => {
    const res = await apiReport.getRevenueReport(filters.value)
    return res.value || []
  },
  {
    immediate: true,
    default: () => []
  }
)

const hasData = computed(() => data.value && Array.isArray(data.value) && data.value.length > 0)

const chartOptions = computed<ApexOptions>(() => {
  if (!hasData.value || !data.value) {
    return {
      chart: {
        type: 'area',
        background: isDark.value ? '#0f172a' : '#ffffff'
      },
      xaxis: {
        categories: []
      }
    } as ApexOptions
  }

  return {
    chart: {
      type: 'area',
      height: 350,
      background: isDark.value ? '#0f172a' : '#ffffff',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2,
      colors: ['#00e080']
    },
    markers: {
      size: 0,
      hover: {
        size: 5,
        sizeOffset: 3
      }
    },
    xaxis: {
      categories: data.value.map((item: IRevenueReport) => item.time),
      title: {
        // text: t('time-period'),
        style: {
          color: isDark.value ? '#9ca3af' : '#6b7280'
        }
      },
      labels: {
        style: {
          colors: isDark.value ? '#9ca3af' : '#6b7280'
        }
      }
    },
    yaxis: {
      labels: {
        formatter: (value: number) => formatPrice(value),
        style: {
          colors: isDark.value ? '#9ca3af' : '#6b7280'
        }
      },
      title: {
        text: t('revenue') + ' (VNĐ)',
        style: {
          color: isDark.value ? '#9ca3af' : '#6b7280'
        }
      }
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number) => formatPrice(value)
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      labels: {
        colors: isDark.value ? '#d1d5db' : '#374151'
      }
    },
    colors: ['#00e080'],
    fill: {
      type: 'gradient',
      gradient: {
        // shade: isDark.value ? 'dark' : 'light',
        // shadeIntensity: isDark.value ? 0.5 : 1,
        // opacityFrom: isDark.value ? 0.7 : 0.7,
        // opacityTo: isDark.value ? 0.1 : 0.3,
        // stops: [0, 90, 100]
      }
    },
    grid: {
      borderColor: isDark.value ? '#374151' : '#e5e7eb',
      strokeDashArray: 4
    }
  }
})

const series = computed(() => {
  if (!hasData.value || !data.value) {
    return []
  }

  return [
    {
      name: t('revenue'),
      data: data.value.map((item: IRevenueReport) => Number(item.value) || 0)
    }
  ]
})

const fromDate = ref<{ $el?: HTMLElement } | null>(null)
const toDate = ref<{ $el?: HTMLElement } | null>(null)

const focusFromDateInput = () => {
  focusDateInput(fromDate)
}

const focusToDateInput = () => {
  focusDateInput(toDate)
}

// Auto-update groupType when date range changes
watch(
  () => [filters.value.fromDate, filters.value.toDate],
  async ([newFromDate, newToDate]) => {
    if (newFromDate && newToDate) {
      filters.value.groupType = getDefaultGroupType(newFromDate, newToDate)
      await execute()
    }
  }
)

// Re-fetch when groupType changes manually
watch(
  () => filters.value.groupType,
  async () => {
    if (filters.value.fromDate && filters.value.toDate) {
      await execute()
    }
  }
)
</script>

<template>
  <div class="dark:bg-bg-seconary-dark bg-white rounded-xl p-6 space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">{{ t('revenue-statistics') }}</h2>
    </div>

    <!-- Filters -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="space-y-2">
        <label class="text-sm font-medium">{{ t('from-date') }}</label>
        <UInput
          ref="fromDate"
          v-model="filters.fromDate"
          type="date"
          :ui="{ base: 'h-10', root: 'w-full' }"
          @click="focusFromDateInput"
        />
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium">{{ t('to-date') }}</label>
        <UInput
          ref="toDate"
          v-model="filters.toDate"
          type="date"
          :ui="{ base: 'h-10', root: 'w-full' }"
          @click="focusToDateInput"
        />
      </div>
    </div>

    <!-- Chart -->
    <div v-if="!pending && hasData" class="w-full rounded-lg overflow-hidden">
      <ClientOnly>
        <VueApexCharts
          v-if="series.length > 0"
          :key="`chart-${filters.groupType}-${data?.length}-${isDark}`"
          type="line"
          :options="chartOptions"
          :series="series"
          height="360"
        />
      </ClientOnly>
    </div>

    <!-- Empty State -->
    <BaseEmpty v-else-if="!pending && (!data || data.length === 0)" />

    <!-- Loading State -->
    <div v-else class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  </div>
</template>

<style scoped></style>
