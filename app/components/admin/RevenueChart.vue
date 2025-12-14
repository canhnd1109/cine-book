<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'
import { ONE_MONTH_MS, ONE_WEEK_MS, ONE_YEAR_MS } from '~/constants'
import { apiReport } from '~/services'
import type { IRevenueReportParams, IRevenueReport } from '~/types/statistics.type'

const { t } = useI18n()

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

const defaultFromDateBooking = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0] || ''
const defaultToDateBooking = new Date().toISOString().split('T')[0] || ''

const filters = ref<IRevenueReportParams>({
  fromDate: defaultFromDate,
  toDate: defaultToDate,
  groupType: getDefaultGroupType(defaultFromDate, defaultToDate)
})
const filtersBooking = ref<IRevenueReportParams>({
  fromDate: defaultFromDateBooking,
  toDate: defaultToDateBooking,
  groupType: getDefaultGroupType(defaultFromDateBooking, defaultToDateBooking)
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

const {
  data: dataBooking,
  pending: pendingBooking,
  execute: executeBooking
} = await useLazyAsyncData(
  'booking-report',
  async () => {
    const res = await apiReport.getRevenueBooking(filtersBooking.value)
    return res.value || []
  },
  {
    immediate: true,
    default: () => []
  }
)

const chartOptions = computed<ApexOptions>(() => {
  if (!data.value || data.value.length === 0) {
    return {
      xaxis: {
        categories: []
      }
    } as ApexOptions
  }

  return {
    chart: {
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
      categories: data.value.map((item: IRevenueReport) => item.time)
    },
    yaxis: {
      labels: {
        formatter: (value: number) => formatPrice(value)
      },
      title: {
        text: t('revenue') + ' (VNĐ)'
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
      horizontalAlign: 'left'
    },
    colors: ['#00e080'],
    fill: {
      type: 'gradient',
      gradient: {}
    }
  }
})

const series = computed(() => {
  if (!data.value || data.value.length === 0) {
    return []
  }

  return [
    {
      name: t('revenue'),
      data: data.value.map((item: IRevenueReport) => Number(item.value) || 0)
    }
  ]
})

const chartOptionsBooking = computed<ApexOptions>(() => {
  if (!dataBooking.value || dataBooking.value.length === 0) {
    return {
      xaxis: {
        categories: []
      }
    } as ApexOptions
  }

  return {
    chart: {
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
      colors: ['#3b82f6']
    },
    markers: {
      size: 0,
      hover: {
        size: 5,
        sizeOffset: 3
      }
    },
    xaxis: {
      categories: dataBooking.value.map((item: IRevenueReport) => item.time)
    },
    yaxis: {
      labels: {
        formatter: (value: number) => formatNumber(value)
      },
      title: {
        text: t('bookings')
      }
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number) => formatNumber(value)
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left'
    },
    colors: ['#3b82f6'],
    fill: {
      type: 'gradient',
      gradient: {}
    }
  }
})

const seriesBooking = computed(() => {
  if (!dataBooking.value || dataBooking.value.length === 0) {
    return []
  }

  return [
    {
      name: t('bookings'),
      data: dataBooking.value.map((item: IRevenueReport) => Number(item.value) || 0)
    }
  ]
})

const fromDate = ref<{ $el?: HTMLElement } | null>(null)
const toDate = ref<{ $el?: HTMLElement } | null>(null)
const fromDateBooking = ref<{ $el?: HTMLElement } | null>(null)
const toDateBooking = ref<{ $el?: HTMLElement } | null>(null)

const focusFromDateInput = () => {
  focusDateInput(fromDate)
}

const focusToDateInput = () => {
  focusDateInput(toDate)
}

const focusFromDateBookingInput = () => {
  focusDateInput(fromDateBooking)
}

const focusToDateBookingInput = () => {
  focusDateInput(toDateBooking)
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

// Auto-update groupType for booking when date range changes
watch(
  () => [filtersBooking.value.fromDate, filtersBooking.value.toDate],
  async ([newFromDate, newToDate]) => {
    if (newFromDate && newToDate) {
      filtersBooking.value.groupType = getDefaultGroupType(newFromDate, newToDate)
      await executeBooking()
    }
  }
)

// Re-fetch booking when groupType changes manually
watch(
  () => filtersBooking.value.groupType,
  async () => {
    if (filtersBooking.value.fromDate && filtersBooking.value.toDate) {
      await executeBooking()
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
    <BaseChart type="area" :options="chartOptions" :series="series" :loading="pending" height="360" />
  </div>

  <div class="dark:bg-bg-seconary-dark bg-white rounded-xl p-6 space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">{{ t('booking-statistics') }}</h2>
    </div>

    <!-- Filters -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="space-y-2">
        <label class="text-sm font-medium">{{ t('from-date') }}</label>
        <UInput
          ref="fromDateBooking"
          v-model="filtersBooking.fromDate"
          type="date"
          :ui="{ base: 'h-10', root: 'w-full' }"
          @click="focusFromDateBookingInput"
        />
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium">{{ t('to-date') }}</label>
        <UInput
          ref="toDateBooking"
          v-model="filtersBooking.toDate"
          type="date"
          :ui="{ base: 'h-10', root: 'w-full' }"
          @click="focusToDateBookingInput"
        />
      </div>
    </div>

    <!-- Chart -->
    <BaseChart type="area" :options="chartOptionsBooking" :series="seriesBooking" :loading="pendingBooking" height="360" />
  </div>
</template>

<style scoped></style>
