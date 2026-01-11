export type LoginCredentials = {
  email: string
  password: string
}

export interface User extends ADMIN {}

export interface ADMIN {
  id: string
  first_name: string
  last_name: string
  email: string
  club_id: string
  admin_name?: string
  username: string
  creator: boolean
  created_at?: string
  updated_at?: string
}

export type Club = {
  id: number
  name: string
  number_of_players?: number
}

export type LoginResponse = {
  access_token: string
  user: User
  club: Club
}

export type USERDATA = Omit<LoginResponse, 'access_token'>

export class AuthError extends Error {
  status: number
  originalError?: unknown

  constructor(message: string, status: number = 400, originalError?: unknown) {
    super(message)
    this.name = 'AuthError'
    this.status = status
    this.originalError = originalError
  }
}

export class ServerError extends Error {
  status: number

  constructor(message: string, originalError: any) {
    super(
      originalError.response?.data?.message || originalError.message || message,
    )
    this.name = 'ServerError'
    this.status = originalError.response?.status || 500
  }
}
