import { Input } from '@/components/ui/input'
import { useAuthQuery } from '@/hooks/use-auth-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/app/auth/_layout/sign-in')({
  component: SignIn,
})

function SignIn() {
  const [email, setEmail] = useState<string>('')
  const { isLoggingIn, login } = useAuthQuery()
  const [password, setPassword] = useState<string>('')
  const navigate = useNavigate()
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    login(
      { email, password },
      {
        onSuccess: () => {
          navigate({ to: '/app/dashboard/home' })
        },
      },
    )
  }

  return (
    <div className="flex flex-col items-center gap-5 justify-center h-screen">
      <h1>Sign In</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full items-center justify-center gap-3"
      >
        <Input
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
          }}
        />
        <Input
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value)
          }}
        />
        <button
          type="submit"
          disabled={isLoggingIn}
          className="px-6 py-1 bg-blue-600 text-white cursor-pointer"
        >
          Login
        </button>
      </form>
    </div>
  )
}
