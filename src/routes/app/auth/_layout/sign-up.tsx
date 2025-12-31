import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import Switch from '@/components/ui/switch'
import { useSignUp } from '@/hooks/club'
import { cn } from '@/lib/utils'
import type { CREATEACCOUNTREQ } from '@/types/club'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/app/auth/_layout/sign-up')({
  component: SignUp,
})

function SignUp() {
  const { mutate: signUp, isPending } = useSignUp()
  const [step, setStep] = useState<1 | 2>(1)
  const nextStep = () => {
    if (step > 1) return
    setStep((step + 1) as 2)
  }
  const prevStep = () => {
    if (step < 2) return
    setStep((step - 1) as 1)
  }
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [formValues, setFormValues] = useState<CREATEACCOUNTREQ>({
    club_name: '',
    creator_is_player: true,
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    creator: true,
    password: '',
  })

  const [fieldError, setFieldError] = useState<
    Omit<CREATEACCOUNTREQ, 'creator_is_player' | 'creator'> & {
      confirm_password: string
    }
  >({
    email: '',
    password: '',
    club_name: '',
    first_name: '',
    last_name: '',
    username: '',
    confirm_password: '',
  })

  const hasError = Object.values(fieldError).some((error) => {
    return error !== ''
  })

  const hasEmptyField = Object.entries(formValues).some(([key, value]) => {
    if (key === 'creator_is_player' || key === 'creator') return false
    return value === ''
  })

  const isInvalid = hasError || hasEmptyField

  const navigate = useNavigate()

  // refactor later
  const validateField = (
    fieldValue: string,
    fieldName: keyof CREATEACCOUNTREQ | 'confirm_password',
  ) => {
    if (fieldName === 'username') {
      if (fieldValue.trim() === '') {
        setFieldError((prev) => ({
          ...prev,
          username: 'Username is required',
        }))
      } else if (fieldValue.trim().includes(' ')) {
        setFieldError((prev) => ({
          ...prev,
          username: 'Username cannot contain spaces',
        }))
      } else {
        setFieldError((prev) => ({ ...prev, username: '' }))
      }
    }
    if (fieldName === 'club_name') {
      if (fieldValue.trim() === '') {
        setFieldError((prev) => ({
          ...prev,
          club_name: 'Club name is required',
        }))
      } else {
        setFieldError((prev) => ({ ...prev, club_name: '' }))
      }
    }
    if (fieldName === 'confirm_password') {
      if (fieldValue !== formValues.password) {
        setFieldError((prev) => ({
          ...prev,
          confirm_password: 'Passwords do not match',
        }))
      } else {
        setFieldError((prev) => ({ ...prev, confirm_password: '' }))
      }
    }
    if (fieldName === 'first_name') {
      if (fieldValue.trim() === '') {
        setFieldError((prev) => ({
          ...prev,
          first_name: 'First name is required',
        }))
      } else {
        setFieldError((prev) => ({ ...prev, first_name: '' }))
      }
    }

    if (fieldName === 'last_name') {
      if (fieldValue.trim() === '') {
        setFieldError((prev) => ({
          ...prev,
          last_name: 'Last name is required',
        }))
      } else {
        setFieldError((prev) => ({ ...prev, last_name: '' }))
      }
    }

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
    signUp(formValues, {
      onSuccess: () => {
        navigate({ to: '/app/auth/sign-in' })
      },
    })
  }

  return (
    <div className="flex flex-col items-center justify-center  h-fit w-[75%] bg-transparent">
      <div className="relative w-full bg-white -mb-[1.5%] py-5 text-sm font-bold rounded-b-md text-center rounded-2xl">
        <p>Create an account</p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col rounded-b-2xl rounded-t-md pt-1 p-5 bg-white w-full items-center justify-center gap-5 pb-6"
      >
        {step === 1 && (
          <div className="contents">
            <div className="w-full flex flex-col gap-1">
              <label
                htmlFor="first_name"
                className="text-sm w-full text-black/50"
              >
                First Name
              </label>
              <Input
                id="first_name"
                type="text"
                value={formValues.first_name}
                placeholder="Enter first name"
                className=""
                onChange={(event) => {
                  validateField(event.target.value, 'first_name')
                  setFormValues((prev) => ({
                    ...prev,
                    first_name: event.target.value,
                  }))
                }}
              />
              {fieldError.first_name && (
                <p className="text-red-500 text-xs">{fieldError.first_name}</p>
              )}
            </div>
            <div className="w-full flex flex-col gap-1">
              <label
                htmlFor="last_name"
                className="text-sm w-full text-black/50"
              >
                Last Name
              </label>
              <Input
                id="last_name"
                type="text"
                value={formValues.last_name}
                placeholder="Enter last name"
                className=""
                onChange={(event) => {
                  validateField(event.target.value, 'last_name')
                  setFormValues((prev) => ({
                    ...prev,
                    last_name: event.target.value,
                  }))
                }}
              />
              {fieldError.last_name && (
                <p className="text-red-500 text-xs">{fieldError.last_name}</p>
              )}
            </div>
            <div className="w-full flex flex-col gap-1">
              <label htmlFor="email" className="text-sm w-full text-black/50">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={formValues.email}
                placeholder="Enter email"
                className=""
                onChange={(event) => {
                  validateField(event.target.value, 'email')
                  setFormValues((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
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
                value={formValues.password}
                placeholder="Enter password"
                onChange={(event) => {
                  validateField(event.target.value, 'password')
                  setFormValues((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }}
              />
              {fieldError.password && (
                <p className="text-red-500 text-xs">{fieldError.password}</p>
              )}
            </div>
            <div className="w-full flex flex-col gap-1">
              <label
                htmlFor="confirm_password"
                className="text-sm w-full text-black/50"
              >
                Confirm Password
              </label>
              <Input
                disabled={
                  formValues.password === '' || fieldError.password !== ''
                }
                type="password"
                value={confirmPassword}
                placeholder="Enter confirm password"
                onChange={(event) => {
                  validateField(event.target.value, 'confirm_password')
                  setConfirmPassword(event.target.value)
                }}
              />
              {fieldError.confirm_password && (
                <p className="text-red-500 text-xs">
                  {fieldError.confirm_password}
                </p>
              )}
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="contents">
            <div className="w-full flex flex-col gap-1">
              <label
                htmlFor="club_name"
                className="text-sm w-full text-black/50"
              >
                Club Name
              </label>
              <Input
                id="club_name"
                type="text"
                value={formValues.club_name}
                placeholder="Enter club name"
                className=""
                onChange={(event) => {
                  validateField(event.target.value, 'club_name')
                  setFormValues((prev) => ({
                    ...prev,
                    club_name: event.target.value,
                  }))
                }}
              />
              {fieldError.club_name && (
                <p className="text-red-500 text-xs">{fieldError.club_name}</p>
              )}
            </div>
            <div className="w-full flex flex-col gap-1">
              <label
                htmlFor="username"
                className="text-sm w-full text-black/50"
              >
                Username
              </label>
              <Input
                id="username"
                type="text"
                value={formValues.username}
                placeholder="Enter username"
                className=""
                onChange={(event) => {
                  validateField(event.target.value, 'username')
                  setFormValues((prev) => ({
                    ...prev,
                    username: event.target.value,
                  }))
                }}
              />
              {fieldError.username && (
                <p className="text-red-500 text-xs">{fieldError.username}</p>
              )}
            </div>
            <div className="w-full flex flex-col gap-1">
              <label
                htmlFor="is_player"
                className="text-sm w-full text-black/50"
              >
                Are you a player?
              </label>
              <Switch
                id="is_player"
                checked={formValues.creator_is_player}
                onCheckedChange={(checked) => {
                  setFormValues((prev) => ({
                    ...prev,
                    creator_is_player: checked,
                  }))
                }}
              />
            </div>
          </div>
        )}
        <div className="justify-between flex w-full items-center">
          {step > 1 && (
            <div className="contents">
              <button
                className="p-1 rounded-md border border-[#b4ff52]/60 cursor-pointer shadow-xs"
                onClick={prevStep}
              >
                <ChevronLeft className="text-slate-600" />
              </button>
              <button
                disabled={isInvalid || isPending}
                type="submit"
                className={cn(
                  'px-4  py-1 rounded-md cursor-pointer text-white bg-[#4d7514] min-h-[32px] min-w-[87.64px]',
                  {
                    'opacity-50 cursor-not-allowed': isInvalid || isPending,
                  },
                )}
              >
                {isPending ? <Spinner size="small" /> : 'Sign Up'}
              </button>
            </div>
          )}

          {step < 2 && (
            <button
              type="submit"
              className="p-1 rounded-md ml-auto border cursor-pointer border-[#b4ff52]/60 shadow-xs"
              onClick={nextStep}
            >
              <ChevronRight className="text-slate-600" />
            </button>
          )}
        </div>
        {/* <button
          type="submit"
          disabled={
            isLoggingIn || fieldError.email !== '' || fieldError.password !== ''
          }
          className={cn(
            'py-2 rounded-lg text-sm font-semibold bg-black w-full text-white cursor-pointer',
            {
              'opacity-20': isLoggingIn,
              'cursor-not-allowed':
                fieldError.email !== '' || fieldError.password !== '',
            },
          )}
        >
          {isLoggingIn ? <Spinner size="small" /> : 'login'}
        </button> */}
      </form>
    </div>
  )
}
