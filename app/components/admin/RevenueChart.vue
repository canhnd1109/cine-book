<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts'
import type { ApexOptions } from 'apexcharts'
import { apiReport } from '~/services'
import type { IRevenueReportParams, IRevenueReport } from '~/types/statistics.type'

const { t } = useI18n()

const groupTypeOptions = [
  { label: t('by-day'), value: 1 },
  { label: t('by-week'), value: 2 },
  { label: t('by-month'), value: 3 },
  { label: t('by-year'), value: 4 }
]

const filters = ref<IRevenueReportParams>({
  groupType: 1,
  fromDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0] || '',
  toDate: new Date().toISOString().split('T')[0] || ''
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
        type: 'area'
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
      width: 2
    },
    xaxis: {
      categories: data.value.map((item: IRevenueReport) => item.time),
      title: {
        text: t('time-period')
      }
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
    colors: ['#3b82f6'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
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

const handleApplyFilter = async () => {
  await execute()
}

const handleResetFilter = async () => {
  filters.value = {
    groupType: 1,
    fromDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0] || '',
    toDate: new Date().toISOString().split('T')[0] || ''
  }
  await execute()
}
</script>

<template>
  <div class="dark:bg-bg-seconary-dark bg-white rounded-xl p-6 space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">{{ t('revenue-statistics') }}</h2>
    </div>

    <!-- Filters -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="space-y-2">
        <label class="text-sm font-medium">{{ t('group-type') }}</label>
        <BaseSelectMenu
          v-model="filters.groupType"
          :items="groupTypeOptions"
          label-key="label"
          value-key="value"
          :placeholder="t('select-group-type')"
          class="w-full"
        />
      </div>

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

      <div class="space-y-2 flex items-end gap-2">
        <BaseButton :text="t('apply')" class="flex-1" variant="solid" :is-loading="pending" @click="handleApplyFilter" />
        <BaseButton :text="t('reset')" class="flex-1" variant="outline" @click="handleResetFilter" />
      </div>
    </div>

    <!-- Chart -->
    <div v-if="!pending && hasData" class="w-full">
      <ClientOnly>
        <VueApexCharts
          v-if="series.length > 0"
          :key="`chart-${filters.groupType}-${data?.length}`"
          type="line"
          :options="chartOptions"
          :series="series"
          height="350"
        />
      </ClientOnly>
    </div>

    <!-- Empty State -->
    <div v-else-if="!pending && (!data || data.length === 0)" class="flex flex-col items-center justify-center py-12">
      <p class="text-gray-500">{{ t('no-data-available') }}</p>
    </div>

    <!-- Loading State -->
    <div v-else class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  </div>
</template>

<style scoped></style>
