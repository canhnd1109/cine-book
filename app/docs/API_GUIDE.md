# API Configuration Guide

## Overview
This project uses a modern, optimized API configuration built with Axios and Nuxt 3 best practices. The system provides reactive composables, automatic token management, error handling, and caching.

## Architecture

### 1. HTTP Plugin (`app/plugins/http.ts`)
- Configures Axios instance with base URL, headers, and timeouts
- Automatic token injection via request interceptors
- Token refresh handling via response interceptors
- CSRF protection support
- Error handling for common HTTP status codes

### 2. Base Service (`app/plugins/base.ts`)
- Generic service class for API endpoints
- Type-safe methods for GET, POST, PUT, PATCH, DELETE
- File upload support
- Consistent error handling
- Response transformation

### 3. Auth Store (`app/stores/auth.ts`)
- Reactive authentication state management
- Token persistence in localStorage
- User profile management
- Role-based access control
- Auto-initialization on client side

### 4. API Composables (`app/composables/useApi.ts`)
- `useApiCall`: Generic API call with reactive state
- `usePaginatedApi`: Paginated data handling
- `useFormSubmit`: Form submission with validation
- `useApiCache`: Cached API calls with TTL

### 5. Service Composables (`app/composables/useServices.ts`)
- Pre-configured services for different API endpoints
- Auth, User, Movie, Theater, Booking, Payment APIs
- Type-safe method signatures

## Usage Examples

### Basic API Call
```typescript
// Using useApiCall
const { data, error, pending, execute } = useApiCall(
  () => apiService.getData(),
  { immediate: true }
)
```

### Paginated Data
```typescript
// Using usePaginatedApi
const { data, currentPage, nextPage, prevPage } = usePaginatedApi(
  (page, limit) => apiService.getPaginatedData(page, limit)
)
```

### Form Submission
```typescript
// Using useFormSubmit
const { data, submit, pending } = useFormSubmit(
  async (formData) => await apiService.submitForm(formData),
  {
    onSuccess: (result) => console.log('Success:', result),
    onError: (error) => console.error('Error:', error)
  }
)
```

### Cached API Calls
```typescript
// Using useApiCache
const { data, refresh, invalidate } = useApiCache(
  'cache-key',
  () => apiService.getExpensiveData(),
  { ttl: 5 * 60 * 1000 } // 5 minutes
)
```

### Authentication
```typescript
// Using auth store
const authStore = useAuthStore()

// Login
await authStore.logIn({
  accessToken: 'token',
  refreshToken: 'refresh',
  user: userData
})

// Check authentication
if (authStore.isLoggedIn) {
  // User is authenticated
}

// Check roles
if (authStore.hasRole('admin')) {
  // User has admin role
}
```

## Configuration

### Environment Variables
```env
# API Configuration
NUXT_PUBLIC_BASE_API_URL=https://api.example.com
API_BASE_URL=https://api.example.com
API_SECRET=your-secret-key
```

### Runtime Config
The system uses Nuxt's runtime config for API URLs and secrets:
- `runtimeConfig.public.baseApiUrl`: Public API base URL
- `runtimeConfig.apiBaseUrl`: Server-side API base URL
- `runtimeConfig.apiSecret`: API secret for server-side calls

## Best Practices

### 1. Error Handling
- All API calls include automatic error handling
- Errors are logged in development mode
- User-friendly error messages are displayed

### 2. Token Management
- Access tokens are automatically injected into requests
- Refresh tokens are handled automatically
- Failed token refresh triggers logout

### 3. Caching
- Use `useApiCache` for expensive operations
- Set appropriate TTL values
- Invalidate cache when data changes

### 4. Loading States
- All composables provide loading states
- Use `pending` refs for UI feedback
- Combine multiple loading states as needed

### 5. Type Safety
- All API responses are typed
- Use TypeScript interfaces for request/response data
- Leverage generic types for reusable components

## Security Features

### 1. CSRF Protection
- Automatic CSRF token injection
- Server-side CSRF validation
- Secure cookie handling

### 2. Token Security
- Tokens stored in httpOnly cookies when possible
- Automatic token refresh
- Secure logout with token invalidation

### 3. Request Validation
- Input validation on client and server
- Type-safe request/response handling
- Error boundary protection

## Performance Optimizations

### 1. Request Deduplication
- Automatic request deduplication for identical calls
- Prevents unnecessary API calls

### 2. Caching Strategy
- Intelligent caching with TTL
- Cache invalidation on data mutations
- Memory-efficient cache management

### 3. Bundle Optimization
- Tree-shaking friendly exports
- Lazy loading of API services
- Minimal bundle impact

## Troubleshooting

### Common Issues

1. **Token Refresh Loops**
   - Check refresh token validity
   - Ensure proper error handling in refresh logic

2. **CORS Issues**
   - Verify API server CORS configuration
   - Check runtime config for correct API URLs

3. **Cache Issues**
   - Clear cache using `invalidate()` method
   - Check TTL settings for appropriate cache duration

4. **Type Errors**
   - Ensure proper TypeScript interfaces
   - Check generic type parameters

### Debug Mode
Enable debug logging in development:
```typescript
// In your component
if (import.meta.dev) {
  console.log('API Debug:', { data, error, pending })
}
```

## Migration from Previous Version

If migrating from a previous API setup:

1. Replace direct axios calls with composables
2. Update error handling to use new error format
3. Migrate authentication logic to use auth store
4. Update type definitions to match new interfaces
5. Test all API endpoints for compatibility

## Contributing

When adding new API endpoints:

1. Add methods to appropriate service composable
2. Create TypeScript interfaces for request/response data
3. Add error handling for new endpoints
4. Update documentation with usage examples
5. Add tests for new functionality
