import { env } from '@/env'

import { Client, Account, Avatars, Databases, Storage } from 'appwrite'

const client = new Client()
  .setEndpoint(env.VITE_APPWRITE_HOST_URL) // Your API Endpoint
  .setProject(env.VITE_APPWRITE_PROJECT_ID) // Your project ID

const database = new Databases(client)
const account = new Account(client)
const storage = new Storage(client)
const avatars = new Avatars(client)

export { client, database, account, storage, avatars }
