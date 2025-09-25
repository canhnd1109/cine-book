# Hướng dẫn sử dụng useUniversalApi

`useUniversalApi` là một composable tổng quát có thể xử lý tất cả các loại API call (GET, POST, PUT, DELETE) với hỗ trợ phân trang, cache và nhiều tính năng khác.

## Tính năng chính

- ✅ **Tất cả HTTP methods**: GET, POST, PUT, DELETE, PATCH
- ✅ **Phân trang tự động**: Hỗ trợ pagination với các helper functions
- ✅ **Cache thông minh**: Cache dữ liệu với TTL tùy chỉnh
- ✅ **Transform dữ liệu**: Chuyển đổi response trước khi sử dụng
- ✅ **Error handling**: Xử lý lỗi tự động với reactive state
- ✅ **TypeScript support**: Type-safe với generic types
- ✅ **Reactive state**: Tự động cập nhật UI khi data thay đổi

## Cú pháp cơ bản

```typescript
const api = useUniversalApi<T>(url, options)
```

## Các tùy chọn (Options)

```typescript
interface Options {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: Record<string, unknown> | FormData | string
  params?: Record<string, string | number | boolean>
  headers?: Record<string, string>
  immediate?: boolean
  pagination?: {
    enabled: boolean
    page?: Ref<number>
    limit?: Ref<number>
    pageParam?: string
    limitParam?: string
  }
  cache?: {
    enabled: boolean
    ttl?: number
    key?: string
  }
  transform?: (data: unknown) => T
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}
```

## Ví dụ sử dụng

### 1. GET Request đơn giản

```typescript
// Lấy danh sách phim
const moviesApi = useUniversalApi<Movie[]>('/api/movies', {
  method: 'GET',
  immediate: true,
  cache: {
    enabled: true,
    ttl: 5 * 60 * 1000 // 5 phút
  }
})

// Sử dụng trong component
const { data: movies, pending, error } = moviesApi
```

### 2. GET Request với phân trang

```typescript
const moviesApi = useUniversalApi<Movie[]>('/api/movies', {
  method: 'GET',
  immediate: true,
  pagination: {
    enabled: true,
    pageParam: 'page',
    limitParam: 'limit'
  }
})

// Sử dụng pagination
const { 
  data: movies, 
  currentPage, 
  totalPages, 
  nextPage, 
  prevPage, 
  goToPage 
} = moviesApi
```

### 3. POST Request (Tạo mới)

```typescript
const createMovieApi = useUniversalApi<Movie>('/api/movies', {
  method: 'POST',
  immediate: false, // Không tự động gọi
  headers: {
    'Authorization': 'Bearer token'
  },
  onSuccess: (data) => {
    console.log('Movie created:', data)
  }
})

// Gọi API khi cần
const createMovie = async (movieData: Partial<Movie>) => {
  await createMovieApi.execute()
}
```

### 4. PUT Request (Cập nhật)

```typescript
const updateMovieApi = useUniversalApi<Movie>(`/api/movies/${movieId}`, {
  method: 'PUT',
  immediate: false,
  body: movieData,
  headers: {
    'Authorization': 'Bearer token'
  }
})
```

### 5. DELETE Request

```typescript
const deleteMovieApi = useUniversalApi<void>(`/api/movies/${movieId}`, {
  method: 'DELETE',
  immediate: false,
  headers: {
    'Authorization': 'Bearer token'
  },
  onSuccess: () => {
    console.log('Movie deleted')
  }
})
```

### 6. GET với Query Parameters

```typescript
const searchApi = useUniversalApi<Movie[]>('/api/movies/search', {
  method: 'GET',
  params: {
    q: 'action',
    genre: 'thriller',
    year: 2023
  },
  cache: {
    enabled: true,
    key: 'movie-search'
  }
})
```

### 7. Transform dữ liệu

```typescript
const moviesApi = useUniversalApi<ProcessedMovie[]>('/api/movies', {
  method: 'GET',
  transform: (response) => {
    // Chuyển đổi dữ liệu từ API
    return response.data.map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      year: movie.release_year,
      rating: movie.imdb_rating,
      isNew: new Date(movie.release_date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    }))
  }
})
```

## Return Values

Hàm trả về một object với các properties sau:

### Data & State
- `data`: Dữ liệu từ API (readonly)
- `error`: Lỗi nếu có (readonly)
- `pending`: Trạng thái loading (readonly)
- `status`: Trạng thái ('idle' | 'pending' | 'success' | 'error')

### Pagination (chỉ có khi `pagination.enabled = true`)
- `total`: Tổng số items
- `totalPages`: Tổng số trang
- `currentPage`: Trang hiện tại
- `limit`: Số items per page
- `nextPage()`: Chuyển trang tiếp theo
- `prevPage()`: Chuyển trang trước
- `goToPage(page)`: Chuyển đến trang cụ thể

### Methods
- `execute(page?)`: Thực thi API call
- `refresh()`: Refresh dữ liệu
- `invalidateCache()`: Xóa cache

## Ví dụ sử dụng trong Vue Component

```vue
<template>
  <div>
    <!-- Hiển thị danh sách -->
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else>
      <div v-for="movie in data" :key="movie.id">
        {{ movie.title }}
      </div>
      
      <!-- Pagination -->
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage <= 1">Previous</button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage >= totalPages">Next</button>
      </div>
    </div>
    
    <!-- Form tạo mới -->
    <form @submit.prevent="handleCreate">
      <input v-model="newMovie.title" placeholder="Title" />
      <button type="submit" :disabled="createPending">
        {{ createPending ? 'Creating...' : 'Create' }}
      </button>
    </form>
  </div>
</template>

<script setup>
// Lấy danh sách với phân trang
const moviesApi = useUniversalApi<Movie[]>('/api/movies', {
  method: 'GET',
  immediate: true,
  pagination: { enabled: true }
})

// Tạo mới
const createApi = useUniversalApi<Movie>('/api/movies', {
  method: 'POST',
  immediate: false
})

const newMovie = ref({ title: '' })

const handleCreate = async () => {
  try {
    await createApi.execute()
    newMovie.value = { title: '' }
    moviesApi.refresh() // Refresh danh sách
  } catch (error) {
    console.error('Create failed:', error)
  }
}

// Destructure để sử dụng
const { 
  data: movies, 
  pending, 
  error, 
  currentPage, 
  totalPages, 
  nextPage, 
  prevPage 
} = moviesApi

const { pending: createPending } = createApi
</script>
```

## So sánh với các hàm cũ

### Trước đây (phải dùng nhiều hàm riêng biệt):
```typescript
// Phải import và sử dụng nhiều hàm
const { data, pending, error } = useApiCall(() => fetchMovies())
const { data: paginatedData, nextPage, prevPage } = usePaginatedApi(fetchMoviesPaginated)
const { submit, pending: submitPending } = useFormSubmit(createMovie)
```

### Bây giờ (chỉ cần 1 hàm):
```typescript
// Chỉ cần 1 hàm cho tất cả
const moviesApi = useUniversalApi('/api/movies', { pagination: { enabled: true } })
const createApi = useUniversalApi('/api/movies', { method: 'POST', immediate: false })
```

## Lợi ích

1. **Đơn giản hóa**: Chỉ cần học 1 API thay vì nhiều hàm khác nhau
2. **Nhất quán**: Cùng một pattern cho tất cả loại request
3. **Linh hoạt**: Có thể tùy chỉnh theo nhu cầu cụ thể
4. **Type-safe**: Hỗ trợ TypeScript đầy đủ
5. **Performance**: Cache tự động và tối ưu hóa
6. **Maintainable**: Dễ bảo trì và mở rộng

## Lưu ý

- Đối với POST/PUT/DELETE, thường set `immediate: false` để không tự động gọi
- Cache chỉ hoạt động với GET requests
- Pagination chỉ có sẵn khi `pagination.enabled = true`
- Luôn handle error trong `onError` callback hoặc try-catch
- Sử dụng `transform` để chuẩn hóa dữ liệu từ API
