import { z } from 'zod'

const envSchema = z.object({
  VITE_APPWRITE_HOST_URL: z.string().url(),
  VITE_APPWRITE_PROJECT_ID: z.string(),
  VITE_BACKEND_URL: z.string(),
})

export const env = envSchema.parse(import.meta.env)
