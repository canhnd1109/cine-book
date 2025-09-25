// Ví dụ sử dụng useUniversalApi - Hàm API chung cho tất cả loại request

import { useUniversalApi } from '~/composables/useApi'

// ===== 1. GET REQUEST ĐƠN GIẢN =====
export function useGetMovies() {
  return useUniversalApi<Movie[]>('/api/movies', {
    method: 'GET',
    immediate: true,
    cache: {
      enabled: true,
      ttl: 5 * 60 * 1000, // 5 phút
      key: 'movies'
    },
    onSuccess: (data) => {
      console.log('Movies loaded:', data)
    },
    onError: (error) => {
      console.error('Failed to load movies:', error)
    }
  })
}

// ===== 2. GET REQUEST VỚI PHÂN TRANG =====
export function useGetMoviesPaginated() {
  return useUniversalApi<Movie[]>('/api/movies', {
    method: 'GET',
    immediate: true,
    pagination: {
      enabled: true,
      pageParam: 'page',
      limitParam: 'limit'
    },
    cache: {
      enabled: true,
      ttl: 2 * 60 * 1000 // 2 phút
    },
    transform: (response) => {
      // Transform response nếu cần
      return response.data || response
    }
  })
}

// ===== 3. POST REQUEST (TẠO MỚI) =====
export function useCreateMovie() {
  return useUniversalApi<Movie>('/api/movies', {
    method: 'POST',
    immediate: false, // Không tự động gọi
    headers: {
      'Authorization': 'Bearer token'
    },
    onSuccess: (data) => {
      console.log('Movie created:', data)
      // Có thể invalidate cache ở đây
    }
  })
}

// ===== 4. PUT REQUEST (CẬP NHẬT) =====
export function useUpdateMovie(movieId: string) {
  return useUniversalApi<Movie>(`/api/movies/${movieId}`, {
    method: 'PUT',
    immediate: false,
    headers: {
      'Authorization': 'Bearer token'
    },
    onSuccess: (data) => {
      console.log('Movie updated:', data)
    }
  })
}

// ===== 5. DELETE REQUEST =====
export function useDeleteMovie(movieId: string) {
  return useUniversalApi<void>(`/api/movies/${movieId}`, {
    method: 'DELETE',
    immediate: false,
    headers: {
      'Authorization': 'Bearer token'
    },
    onSuccess: () => {
      console.log('Movie deleted')
    }
  })
}

// ===== 6. GET VỚI QUERY PARAMETERS =====
export function useSearchMovies(query: string) {
  return useUniversalApi<Movie[]>('/api/movies/search', {
    method: 'GET',
    params: {
      q: query,
      genre: 'action',
      year: 2023
    },
    immediate: false,
    cache: {
      enabled: true,
      key: `search-${query}`
    }
  })
}

// ===== 7. SỬ DỤNG TRONG COMPONENT =====
export function useMovieComponent() {
  // Lấy danh sách phim có phân trang
  const moviesApi = useGetMoviesPaginated()

  // Tạo phim mới
  const createMovieApi = useCreateMovie()

  // Tìm kiếm phim
  const searchApi = useSearchMovies('')

  // Hàm tạo phim mới
  const createMovie = async (movieData: Partial<Movie>) => {
    try {
      await createMovieApi.execute()
      // Refresh danh sách phim
      moviesApi.refresh()
    } catch (error) {
      console.error('Failed to create movie:', error)
    }
  }

  // Hàm tìm kiếm
  const searchMovies = async (query: string) => {
    searchApi.execute() // Sẽ sử dụng params đã set
  }

  return {
    // Movies data
    movies: moviesApi.data,
    moviesPending: moviesApi.pending,
    moviesError: moviesApi.error,

    // Pagination
    currentPage: moviesApi.currentPage,
    totalPages: moviesApi.totalPages,
    total: moviesApi.total,
    nextPage: moviesApi.nextPage,
    prevPage: moviesApi.prevPage,
    goToPage: moviesApi.goToPage,

    // Create movie
    createMovie,
    createPending: createMovieApi.pending,
    createError: createMovieApi.error,

    // Search
    searchMovies,
    searchResults: searchApi.data,
    searchPending: searchApi.pending
  }
}

// ===== 8. VÍ DỤ SỬ DỤNG TRONG VUE COMPONENT =====
/*
<template>
  <div>
    <!-- Hiển thị danh sách phim -->
    <div v-if="moviesPending">Loading...</div>
    <div v-else-if="moviesError">Error: {{ moviesError.message }}</div>
    <div v-else>
      <div v-for="movie in movies" :key="movie.id">
        {{ movie.title }}
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage <= 1">Previous</button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage >= totalPages">Next</button>
      </div>
    </div>

    <!-- Form tạo phim mới -->
    <form @submit.prevent="handleCreateMovie">
      <input v-model="newMovie.title" placeholder="Movie title" />
      <button type="submit" :disabled="createPending">
        {{ createPending ? 'Creating...' : 'Create Movie' }}
      </button>
    </form>
  </div>
</template>

<script setup>
const {
  movies,
  moviesPending,
  moviesError,
  currentPage,
  totalPages,
  nextPage,
  prevPage,
  createMovie,
  createPending,
  createError
} = useMovieComponent()

const newMovie = ref({ title: '' })

const handleCreateMovie = async () => {
  await createMovie(newMovie.value)
  newMovie.value = { title: '' }
}
</script>
*/

// ===== 9. ADVANCED USAGE - CUSTOM TRANSFORM =====
export function useMoviesWithTransform() {
  return useUniversalApi<ProcessedMovie[]>('/api/movies', {
    method: 'GET',
    immediate: true,
    transform: (response) => {
      // Transform dữ liệu từ API thành format mong muốn
      return response.data.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        year: movie.release_year,
        rating: movie.imdb_rating,
        poster: movie.poster_url,
        // Tính toán thêm
        isNew: new Date(movie.release_date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        category: movie.rating >= 8 ? 'excellent' : movie.rating >= 6 ? 'good' : 'average'
      }))
    },
    cache: {
      enabled: true,
      key: 'processed-movies'
    }
  })
}

// ===== 10. CONDITIONAL API CALLS =====
export function useConditionalApi() {
  const shouldFetch = ref(false)

  const api = useUniversalApi<Movie[]>('/api/movies', {
    method: 'GET',
    immediate: false, // Không tự động gọi
    cache: {
      enabled: true
    }
  })

  // Chỉ gọi API khi điều kiện đúng
  watch(shouldFetch, (newValue) => {
    if (newValue) {
      api.execute()
    }
  })

  return {
    ...api,
    shouldFetch,
    triggerFetch: () => { shouldFetch.value = true }
  }
}

// Types
interface Movie {
  id: string
  title: string
  year: number
  rating: number
  poster: string
}

interface ProcessedMovie extends Movie {
  isNew: boolean
  category: 'excellent' | 'good' | 'average'
}
