export interface IMovieFilter {
  // {1}. Sắp xếp theo thời gian khởi chiếu
  // {2}. Sắp xếp theo giá vé
  // {3}. Sắp xếp theo tên
  // {4}. Sắp xếp theo số lượt xem
  // {5}. Sắp xếp theo lượt thời lượng chiếu
  searchName: string
  orderBy: '1' | '2' | '3' | '4' | '5' | ''
  genre: string
  minPrice: string | number
  maxPrice: string | number
  price: string | number
  pageIndex: number
  pageSize: number
  orderType: string
}

export interface IMovie {
  id: string
  name: string
  description: string
  director: string
  performer: string
  releaseDate: string
  closeDate: string
  nation: string
  duration: number
  note: string
  price: number
  trailerUrl: string
  posterUrl: string
  genres: string[]
}
