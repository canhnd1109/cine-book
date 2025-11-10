import type { IPagination } from '~/types/query.type'

const MAX_FILES = 5
const MAX_SIZE_IMAGE_UPLOAD = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const DEFAULT_QUERY_PAGINATION: IPagination = {
  pageIndex: 1,
  pageSize: 50
}

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

const PHONE_NUMBER_REGEX = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g
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

const LIST_PRICE_MOVIE = [
  {
    label: 'Dưới 100.000đ',
    value: '100000'
  },
  {
    label: '100.000đ - 200.000đ',
    value: '100000-200000'
  },
  {
    label: '200.000đ - 300.000đ',
    value: '200000-300000'
  },
  {
    label: '300.000đ - 400.000đ',
    value: '300000-400000'
  },
  {
    label: '400.000đ - 500.000đ',
    value: '400000-500000'
  },
  {
    label: 'Trên 500.000đ',
    value: '500000'
  }
]

const SEAT_TYPE = [
  {
    label: 'Ghế thường',
    value: 'NORMAL'
  },
  {
    label: 'Ghế VIP',
    value: 'VIP'
  },
  {
    label: 'Ghế đôi',
    value: 'COUPLE'
  },
  {
    label: 'Ghế không hoạt động',
    value: 'DISABLED'
  }
]

export {
  MAX_SIZE_IMAGE_UPLOAD,
  DEFAULT_QUERY_PAGINATION,
  ORDER_BY_MOVIE,
  LIST_PRICE_MOVIE,
  PASSWORD_REGEX,
  PHONE_NUMBER_REGEX,
  ACCEPTED_IMAGE_TYPES,
  MAX_FILES,
  SEAT_TYPE
}
