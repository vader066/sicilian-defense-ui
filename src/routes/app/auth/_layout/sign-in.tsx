import { createFileRoute } from '@tanstack/react-router'
import { account } from '@/services/appwrite-client/config'
import { OAuthProvider } from 'appwrite'

export const Route = createFileRoute('/app/auth/_layout/sign-in')({
  component: SignIn,
})

function SignIn() {
  const handleClick = async () => {
    account.createOAuth2Session(
      OAuthProvider.Google,
      'http://localhost:3000/app/dashboard/home',
      'http://localhost:3000/app/auth/sign-in',
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
