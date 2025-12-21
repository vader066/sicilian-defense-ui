import {
  AuthError,
  type LoginCredentials,
  type LoginResponse,
  type User,
  type USERDATA,
} from '@/types/auth'
import api from './api-client'
import type { ApiResponse } from './types'

export const AuthService = {
  getToken(): string | null {
    return localStorage.getItem('access_token')
  },

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post<ApiResponse<LoginResponse>>(
        '/admin/login',
        credentials,
      )
      const token = response.data.data.access_token
      localStorage.setItem('access_token', token)
      const user: USERDATA = {
        user: response.data.data.user,
        club: response.data.data.club,
      }
      localStorage.setItem('user_data', JSON.stringify(user))

      return response.data.data
    } catch (error) {
      throw new AuthError('Login failed', 401, error)
    }
  },

  async refreshToken(): Promise<string | null> {
    try {
      const response =
        await api.post<ApiResponse<{ access_token: string }>>('/admin/refresh')

      const newToken = response.data.data.access_token
      localStorage.setItem('access_token', newToken)
      return newToken
    } catch (error) {
      this.logout()
      return null
    }
  },

  async logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    api.post('/admin/logout').catch((error) => {
      throw new AuthError('Logout failed', 500, error)
    })
  },

  getUserData(): USERDATA {
    const userData = localStorage.getItem('user_data')
    if (!userData) {
      throw new AuthError('No user data found', 401)
    }
    return JSON.parse(userData)
  },
}
