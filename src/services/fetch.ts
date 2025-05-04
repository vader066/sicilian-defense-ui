import { env } from '@/env'
import { type ApiResponse } from './types'

/**
 * a simple fetch handler to handle http requests
 */
export async function localFetch<T>(
  path: `/${string}`,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const url = `${env.VITE_BACKEND_URL}${path}`
  // const opts = options;

  // if (token) {
  //   opts.headers = {
  //     Authorization: `Bearer ${token}`,
  //     ...opts.headers,
  //   };
  // }

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!res.ok) {
    const errMsg = await res.json()
    const { status } = res

    if (status === 401) {
      throw Error('Unauthorized')
    }

    let msg: string = errMsg?.message ?? 'An error occurred. Please try again.'
    msg = msg.charAt(0).toUpperCase() + msg.slice(1)
    throw Error(msg)
  }

  if (res.status === 204) {
    return {} as ApiResponse<T> // Return an empty object or null
  }

  return res.json()
}
