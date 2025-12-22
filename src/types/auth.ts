export type LoginCredentials = {
  email: string
  password: string
}

export type User = {
  // complete this later
  id: number
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
