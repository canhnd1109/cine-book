<script setup lang="ts" generic="T extends Record<string, any>">
import { getPaginationRowModel } from '@tanstack/vue-table'
import type { TableColumn } from '@nuxt/ui'

interface Props {
  data: T[]
  columns: TableColumn<T>[]
  pageSize?: number
  showPagination?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  pageSize: 5,
  showPagination: true
})

const table = useTemplateRef('table')

const pagination = ref({
  pageIndex: 0,
  pageSize: props.pageSize
})
</script>

<template>
  <div class="w-full space-y-4 pb-4">
    <UTable
      ref="table"
      v-model:pagination="pagination"
      :data="data"
      :columns="columns"
      :pagination-options="{
        getPaginationRowModel: getPaginationRowModel()
      }"
      class="flex-1"
    />

    <div v-if="showPagination" class="flex justify-center border-t border-default pt-4">
      <UPagination
        :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
        :items-per-page="table?.tableApi?.getState().pagination.pageSize"
        :total="table?.tableApi?.getFilteredRowModel().rows.length"
        @update:page="p => table?.tableApi?.setPageIndex(p - 1)"
      />
    </div>
  </div>
</template>
