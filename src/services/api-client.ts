import { env } from '@/env'
import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { AuthService } from './auth'

const api = axios.create({
  baseURL: env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  paramsSerializer: {
    indexes: false,
  },
})

// Track if we're currently refreshing to prevent multiple refreshes
let isRefreshing = false
// Store pending requests to retry after token refresh
const pendingRequests: Array<{
  config: InternalAxiosRequestConfig
  resolve: (value: unknown) => void
  reject: (reason?: any) => void
}> = []

// Helper to strip query params from URL
function stripQuery(url: string) {
  return url.split('?')[0]
}

function setupApiInterceptors(apiInstance: AxiosInstance = api) {
  const publicEndpoints = ['/auth/login', '/auth/logout', '/auth/refresh']
  /*
   * Request interceptor to add auth token to headers for protected endpoints
   */
  apiInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const path = stripQuery(config.url ?? '')
      const isPublicEndpoint = publicEndpoints.includes(path)
      if (!isPublicEndpoint) {
        const token = localStorage.getItem('access_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } else {
        delete config.headers.Authorization
      }
      return config
    },
    (error: AxiosError) => Promise.reject(error),
  )
  /*
   * Response interceptor to handle refresh (only once) on 401 responses
   */
  apiInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const orignalRequest = error.config as InternalAxiosRequestConfig
      if (
        !error.response ||
        error.response.status !== 401 ||
        orignalRequest.__isRetryRequest
      ) {
        return Promise.reject(error)
      }

      orignalRequest.__isRetryRequest = true
      // Only refresh if not already refreshing
      if (!isRefreshing) {
        isRefreshing = true

        try {
          // call refresh endpoint
          const newToken = await AuthService.refreshToken()

          //retry all pending requests with the new token
          if (newToken) {
            pendingRequests.forEach(({ config, resolve, reject }) => {
              config.headers.Authorization = `Bearer ${newToken}`
              apiInstance(config)
                .then((response) => resolve(response))
                .catch((err) => reject(err))
            })

            // Clear pending requests
            pendingRequests.length = 0

            // retry the orginal request with new token
            orignalRequest.headers.Authorization = `Bearer ${newToken}`
            return apiInstance(orignalRequest)
          } else {
            // If refresh failed, reject all pending requests
            pendingRequests.forEach(({ reject }) => {
              reject(new Error('Unable to refresh token'))
            })

            // Clear pending requests
            pendingRequests.length = 0

            // force logout because token is invalid and cannot be refreshed
            AuthService.logout()
            return Promise.reject(error)
          }
        } catch (error) {
          // If refresh failed, reject all pending requests
          pendingRequests.forEach(({ reject }) => {
            reject(new Error('Unable to refresh token'))
          })
          // Clear pending requests
          pendingRequests.length = 0

          // force logout because token is invalid and cannot be refreshed
          AuthService.logout()
          return Promise.reject(error)
        } finally {
          isRefreshing = false
        }
      } else {
        // If refresh is already in progress, queue the request
        return new Promise((resolve, reject) => {
          pendingRequests.push({ config: orignalRequest, resolve, reject })
        })
      }
    },
  )
}

// Initialize interceptors
setupApiInterceptors()

// Export types for reuse
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    __isRetryRequest?: boolean
  }
}

export default api
