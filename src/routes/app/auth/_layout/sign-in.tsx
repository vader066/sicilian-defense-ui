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
    <div className="flex flex-col items-center justify-center h-fit w-[65%]">
      <div className="relative w-full bg-white -mb-[0.5%] py-5 text-sm font-bold rounded-b-md text-center rounded-xl">
        <p>Login to your account</p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col rounded-xl rounded-t-md pt-1 p-5 bg-white w-full items-center justify-center gap-5"
      >
        <div className="w-full flex flex-col gap-1">
          <label htmlFor="email" className="text-sm w-full text-black/50">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            placeholder="Enter email"
            className=""
            onChange={(event) => {
              setEmail(event.target.value)
            }}
          />
        </div>
        <div className="w-full flex flex-col gap-1">
          <label htmlFor="email" className="text-sm w-full text-black/50">
            Password
          </label>
          <Input
            type="password"
            value={password}
            placeholder="Enter password"
            onChange={(event) => {
              setPassword(event.target.value)
            }}
          />
        </div>
        <div className="w-full flex items-center gap-2">
          <input type="checkbox" name="remember-me" id="remember-me" />
          <span className="text-xs font-bold">Remember me</span>
          <a href="#" className="text-xs text-black/50 ml-auto">
            Forgot your password
          </a>
        </div>
        <button
          type="submit"
          disabled={isLoggingIn}
          className="py-2 rounded-lg text-sm font-bold bg-black w-full text-white cursor-pointer"
        >
          login
        </button>
        <div className="w-full rounded-xl h-24 bg-red-50" />
      </form>
    </div>
  )
}
