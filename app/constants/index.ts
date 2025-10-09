import type { IPagination } from '~/types/query.type'

const MAX_SIZE_IMAGE_UPLOAD = 5 * 1024 * 1024 // 5MB
const DEFAULT_QUERY_PAGINATION: IPagination = {
  pageIndex: 1,
  pageSize: 50
}

// {1}. Sắp xếp theo thời gian khởi chiếu
// {2}. Sắp xếp theo giá vé
// {3}. Sắp xếp theo tên
// {4}. Sắp xếp theo số lượt xem
// {5}. Sắp xếp theo lượt thời lượng chiếu

const ORDER_BY_MOVIE = [
  {
    label: 'Thời gian khởi chiếu',
    value: 1
  },
  {
    label: 'Giá vé',
    value: 2
  },
  {
    label: 'Tên',
    value: 3
  },
  {
    label: 'Số lượt xem',
    value: 4
  },
  {
    label: 'Thời lượng chiếu',
    value: 5
  }
]

export { MAX_SIZE_IMAGE_UPLOAD, DEFAULT_QUERY_PAGINATION, ORDER_BY_MOVIE }
