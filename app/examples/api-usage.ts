// Example usage of the optimized API system
// This file demonstrates how to use the new composables and services

// Example 1: Using useApiCall for simple API calls
export function useMovieList() {
  const { getMovies } = useMovieApi()

  return useApiCall(
    () => getMovies({ page: 1, limit: 10 }),
    {
      immediate: true,
      transform: (response) => response.data
    }
  )
}

// Example 2: Using usePaginatedApi for paginated data
export function usePaginatedMovies() {
  const { getMovies } = useMovieApi()

  return usePaginatedApi(
    (page, limit) => getMovies({ page, limit }),
    {
      immediate: true
    }
  )
}

// Example 3: Using useFormSubmit for form handling
export function useLoginForm() {
  const { login } = useAuthApi()
  const authStore = useAuthStore()

  return useFormSubmit(
    async (credentials) => {
      const response = await login(credentials)
      await authStore.logIn(response.data)
      return response
    },
    {
      onSuccess: () => {
        // Show success message
        const toast = useToast()
        toast.add({
          title: 'Success',
          description: 'Logged in successfully!',
          color: 'green'
        })
      },
      onError: (error) => {
        // Show error message
        const toast = useToast()
        toast.add({
          title: 'Error',
          description: error.message,
          color: 'red'
        })
      }
    }
  )
}

// Example 4: Using useApiCache for cached data
export function useCachedMovieDetails(movieId: string) {
  const { getMovie } = useMovieApi()

  return useApiCache(
    `movie-${movieId}`,
    () => getMovie(movieId),
    {
      ttl: 10 * 60 * 1000, // 10 minutes
      immediate: true
    }
  )
}

// Example 5: Complex booking flow
export function useBookingFlow() {
  const { createBooking, confirmPayment } = useBookingApi()
  const { createPayment } = usePaymentApi()

  const bookingData = ref({
    scheduleId: '',
    seats: [] as string[],
    customerInfo: {
      name: '',
      email: '',
      phone: ''
    }
  })

  const paymentData = ref({
    method: '',
    amount: 0
  })

  const { data: booking, error: bookingError, pending: bookingPending, execute: createBookingRequest } = useApiCall(
    () => createBooking(bookingData.value),
    { immediate: false }
  )

  const { data: payment, error: paymentError, pending: paymentPending, execute: createPaymentRequest } = useApiCall(
    () => createPayment({
      bookingId: booking.value?.data.id || '',
      amount: paymentData.value.amount,
      method: paymentData.value.method
    }),
    { immediate: false }
  )

  const processBooking = async () => {
    try {
      // Step 1: Create booking
      await createBookingRequest()

      // Step 2: Create payment
      await createPaymentRequest()

      // Step 3: Confirm payment
      if (payment.value?.data.id) {
        await confirmPayment(booking.value?.data.id || '', payment.value.data)
      }

      return { booking: booking.value, payment: payment.value }
    } catch (error) {
      throw error
    }
  }

  return {
    bookingData,
    paymentData,
    booking,
    payment,
    bookingError,
    paymentError,
    bookingPending,
    paymentPending,
    processBooking
  }
}

// Example 6: Using in a Vue component
/*
<script setup lang="ts">
// In your Vue component
const { data: movies, error, pending, refresh } = useMovieList()
const { data: paginatedMovies, currentPage, nextPage, prevPage } = usePaginatedMovies()
const { data: formData, submit, pending: submitting } = useLoginForm()

// Handle form submission
const handleLogin = async () => {
  try {
    await submit()
    // Form will automatically handle success/error via callbacks
  } catch (error) {
    // Additional error handling if needed
  }
}
</script>

<template>
  <div>
    <!-- Loading state -->
    <div v-if="pending">Loading movies...</div>

    <!-- Error state -->
    <div v-if="error" class="error">
      {{ error.message }}
      <button @click="refresh">Retry</button>
    </div>

    <!-- Success state -->
    <div v-else-if="movies">
      <div v-for="movie in movies" :key="movie.id">
        {{ movie.title }}
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage <= 1">Previous</button>
      <span>Page {{ currentPage }}</span>
      <button @click="nextPage">Next</button>
    </div>

    <!-- Login form -->
    <form @submit.prevent="handleLogin">
      <input v-model="formData.email" type="email" placeholder="Email" />
      <input v-model="formData.password" type="password" placeholder="Password" />
      <button type="submit" :disabled="submitting">
        {{ submitting ? 'Logging in...' : 'Login' }}
      </button>
    </form>
  </div>
</template>
*/
