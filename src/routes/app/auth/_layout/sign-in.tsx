import { createFileRoute } from '@tanstack/react-router'
import { account } from '@/services/appwrite-client/config'
import { OAuthProvider } from 'appwrite'
import { env } from '@/env'

export const Route = createFileRoute('/app/auth/_layout/sign-in')({
  component: SignIn,
})
const frontendURL = env.VITE_FRONTEND_URL
function SignIn() {
  const handleClick = async () => {
    account.createOAuth2Session(
      OAuthProvider.Google,
      `https://testing-someting.com/app/dashboard/home`,
      `https://testing-someting.com/app/auth/sign-in`,
      // `${frontendURL}/app/dashboard/home`,
      // `${frontendURL}/app/auth/sign-in`,
    )
  }
  return (
    <div className="flex flex-col items-center gap-5 justify-center h-screen">
      <h1>Sign In</h1>
      <button
        type="button"
        onClick={() => {
          handleClick()
        }}
        className="px-6 py-1 bg-blue-600 text-white"
      >
        Google
      </button>
    </div>
  )
}
