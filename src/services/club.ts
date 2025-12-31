import type { CREATEACCOUNTREQ, CREATEACCOUNTRES } from '@/types/club'
import api from './api-client'
import type { ApiResponse } from './types'

export const clubService = {
  async signUp(signUpReq: CREATEACCOUNTREQ): Promise<CREATEACCOUNTRES> {
    try {
      const response = await api.post<ApiResponse<CREATEACCOUNTRES>>(
        'admin/sign-up',
        signUpReq,
      )
      return response.data.data
    } catch (error) {
      throw error
    }
  },
}
