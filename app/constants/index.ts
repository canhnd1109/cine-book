import type { IPagination } from '~/types/query.type'

const MAX_SIZE_IMAGE_UPLOAD = 5 * 1024 * 1024 // 5MB
const DEFAULT_QUERY_PAGINATION: IPagination = {
  pageIndex: 1,
  pageSize: 50
}

export { MAX_SIZE_IMAGE_UPLOAD, DEFAULT_QUERY_PAGINATION }
