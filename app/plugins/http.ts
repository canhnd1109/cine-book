import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import type { LoginResponse } from '~/types/auth.types'
import { useAuthStore } from '~/stores/auth'

const API_REQUEST_TIMEOUT = 20000; // 20s
const headers = { "App-Code": "hit-members" };

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig();
  const authStore = useAuthStore();

  const $http: AxiosInstance = axios.create({
    baseURL: `${runtimeConfig.public.baseApiUrl}/api/v1`,
    headers,
    timeout: API_REQUEST_TIMEOUT,
  });

  // Request interceptor để thêm token vào header
  $http.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = authStore.accessToken;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor để xử lý lỗi 401 và refresh token
  $http.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (!originalRequest.url?.includes("/auth")) {
          originalRequest._retry = true;

          try {
            const config = useRuntimeConfig();
            const response = await axios.post<LoginResponse>(
              `${config.public.baseApiUrl}/api/v1/auth/refresh`,
              { refreshToken: authStore.refreshToken }
            );

            authStore.logIn(response.data, false);
            await refreshNuxtData();

            // Retry original request với token mới
            const token = authStore.accessToken;
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return $http(originalRequest);
          } catch {
            console.error(error.response?.data);
            authStore.logOut();
            return Promise.reject(new Error("Token refresh failed"));
          }
        } else {
          console.error(error.response?.data);
          authStore.logOut({ redirect: (useRoute().query.redirect as string) || "/" });
        }
      }

      return Promise.reject(error);
    }
  );

  return {
    provide: { http: $http }
  };
});
