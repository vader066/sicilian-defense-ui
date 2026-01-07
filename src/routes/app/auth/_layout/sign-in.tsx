import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useAuthQuery } from '@/hooks/use-auth-query'
import { cn } from '@/lib/utils'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/app/auth/_layout/sign-in')({
  component: SignIn,
})

function SignIn() {
  const [email, setEmail] = useState<string>('')
  const { isLoggingIn, login } = useAuthQuery()
  const [password, setPassword] = useState<string>('')
  const [fieldError, setFieldError] = useState({
    email: '',
    password: '',
  })
  const navigate = useNavigate()
  const validateField = (
    fieldValue: string,
    fieldName: 'password' | 'email',
  ) => {
    if (fieldName === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(fieldValue)) {
        setFieldError((prev) => ({ ...prev, email: 'Invalid email address' }))
      } else {
        setFieldError((prev) => ({ ...prev, email: '' }))
      }
    }

    if (fieldName === 'password') {
      if (fieldValue.length < 6) {
        setFieldError((prev) => ({
          ...prev,
          password: 'Password must be at least 6 characters',
        }))
      } else {
        setFieldError((prev) => ({ ...prev, password: '' }))
      }
    }
  }
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
    <div className="flex flex-col items-center justify-center  h-fit w-[75%] bg-transparent">
      <div className="relative w-full bg-white -mb-[1.5%] py-5 text-sm font-bold rounded-b-md text-center rounded-2xl">
        <p>Login to your account</p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col rounded-b-2xl rounded-t-md pt-1 p-5 bg-white w-full items-center justify-center gap-5 pb-40  [mask-image:url('/images/cut-out.svg')]
          [mask-repeat:no-repeat]
          [mask-position:center]
          [mask-size:100%_100%]
          [--webkit-mask-image:url('/images/cut-out.svg')]
          [-webkit-mask-repeat:no-repeat]
          [-webkit-mask-position:center]
          [-webkit-mask-size:100%_100%]"
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
              validateField(event.target.value, 'email')
              setEmail(event.target.value)
            }}
          />
          {fieldError.email && (
            <p className="text-red-500 text-xs">{fieldError.email}</p>
          )}
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
              validateField(event.target.value, 'password')
              setPassword(event.target.value)
            }}
          />
          {fieldError.password && (
            <p className="text-red-500 text-xs">{fieldError.password}</p>
          )}
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
          disabled={
            isLoggingIn || fieldError.email !== '' || fieldError.password !== ''
          }
          className={cn(
            'py-2 rounded-lg text-sm font-semibold bg-black w-full text-white cursor-pointer min-h-[36px]',
            {
              'opacity-20': isLoggingIn,
              'cursor-not-allowed':
                fieldError.email !== '' || fieldError.password !== '',
            },
          )}
        >
          {isLoggingIn ? <Spinner size="small" /> : 'login'}
        </button>
      </form>
    </div>
  )
}
