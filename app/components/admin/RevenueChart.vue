<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'
import { ONE_MONTH_MS, ONE_WEEK_MS, ONE_YEAR_MS } from '~/constants'
import { apiReport } from '~/services'
import type { IRevenueReportParams, IRevenueReport } from '~/types/statistics.type'

const { t } = useI18n()

// Constants
const CHART_COLORS = {
  REVENUE: '#00e080',
  BOOKING: '#3b82f6'
} as const

const TOOLBAR_CONFIG = {
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
} as const

// Helper functions
const getDefaultGroupType = (fromDate: string, toDate: string): number => {
  const diff = new Date(toDate).getTime() - new Date(fromDate).getTime()

  if (diff > ONE_YEAR_MS) return 4 // By year
  if (diff > ONE_MONTH_MS) return 3 // By month
  if (diff > ONE_WEEK_MS) return 2 // By week
  return 1 // By day
}

const getDefaultDateRange = () => {
  const today = new Date()
  const thirtyDaysAgo = new Date(today)
  thirtyDaysAgo.setDate(today.getDate() - 30)

  return {
    fromDate: thirtyDaysAgo.toISOString().split('T')[0] || '',
    toDate: today.toISOString().split('T')[0] || ''
  }
}

const createDefaultFilters = (): IRevenueReportParams => {
  const { fromDate, toDate } = getDefaultDateRange()
  return {
    fromDate,
    toDate,
    groupType: getDefaultGroupType(fromDate, toDate)
  }
}

// State
const filters = ref<IRevenueReportParams>(createDefaultFilters())
const filtersBooking = ref<IRevenueReportParams>(createDefaultFilters())

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

// Shared chart configuration factory
const createChartOptions = (
  chartData: IRevenueReport[] | null,
  color: string,
  yAxisTitle: string,
  formatter: (value: number) => string
): ApexOptions => {
  if (!chartData?.length) {
    return { xaxis: { categories: [] } } as ApexOptions
  }

  return {
    chart: { toolbar: TOOLBAR_CONFIG },
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 2,
      colors: [color]
    },
    markers: {
      size: 0,
      hover: { size: 5, sizeOffset: 3 }
    },
    xaxis: {
      categories: chartData.map(item => item.time)
    },
    yaxis: {
      labels: { formatter },
      title: { text: yAxisTitle }
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: { formatter }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left'
    },
    colors: [color],
    fill: {
      type: 'gradient',
      gradient: {}
    }
  }
}

const createSeries = (chartData: IRevenueReport[] | null, name: string) => {
  if (!chartData?.length) return []

  return [
    {
      name,
      data: chartData.map(item => Number(item.value) || 0)
    }
  ]
}

// Chart configurations
const chartOptions = computed(() => createChartOptions(data.value, CHART_COLORS.REVENUE, `${t('revenue')} (VNĐ)`, formatPrice))

const series = computed(() => createSeries(data.value, t('revenue')))

const chartOptionsBooking = computed(() =>
  createChartOptions(dataBooking.value, CHART_COLORS.BOOKING, t('bookings'), formatNumber)
)

const seriesBooking = computed(() => createSeries(dataBooking.value, t('bookings')))

// Template refs
const fromDate = ref<{ $el?: HTMLElement } | null>(null)
const toDate = ref<{ $el?: HTMLElement } | null>(null)
const fromDateBooking = ref<{ $el?: HTMLElement } | null>(null)
const toDateBooking = ref<{ $el?: HTMLElement } | null>(null)

// Focus handlers
const focusFromDateInput = () => focusDateInput(fromDate)
const focusToDateInput = () => focusDateInput(toDate)
const focusFromDateBookingInput = () => focusDateInput(fromDateBooking)
const focusToDateBookingInput = () => focusDateInput(toDateBooking)

// Watch helper factory
const createFilterWatcher = (
  filterRef: typeof filters | typeof filtersBooking,
  executeFn: typeof execute | typeof executeBooking
) => {
  // Auto-update groupType and refetch when date range changes
  watch(
    () => [filterRef.value.fromDate, filterRef.value.toDate] as const,
    async ([newFromDate, newToDate]) => {
      if (newFromDate && newToDate) {
        filterRef.value.groupType = getDefaultGroupType(newFromDate, newToDate)
        await executeFn()
      }
    }
  )

  // Refetch when groupType changes manually
  watch(
    () => filterRef.value.groupType,
    async () => {
      if (filterRef.value.fromDate && filterRef.value.toDate) {
        await executeFn()
      }
    }
  )
}

// Setup watchers
createFilterWatcher(filters, execute)
createFilterWatcher(filtersBooking, executeBooking)
</script>

<template>
  <AdminChartSection
    v-model:from-date="filters.fromDate"
    v-model:to-date="filters.toDate"
    :title="t('revenue-statistics')"
    :from-date-label="t('from-date')"
    :to-date-label="t('to-date')"
    :chart-options="chartOptions"
    :series="series"
    :loading="pending"
    @focus-from-date="focusFromDateInput"
    @focus-to-date="focusToDateInput"
  />

  <AdminChartSection
    v-model:from-date="filtersBooking.fromDate"
    v-model:to-date="filtersBooking.toDate"
    :title="t('booking-statistics')"
    :from-date-label="t('from-date')"
    :to-date-label="t('to-date')"
    :chart-options="chartOptionsBooking"
    :series="seriesBooking"
    :loading="pendingBooking"
    @focus-from-date="focusFromDateBookingInput"
    @focus-to-date="focusToDateBookingInput"
  />
</template>

<style scoped></style>
