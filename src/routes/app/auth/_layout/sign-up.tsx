import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/auth/_layout/sign-up')({
  component: SignUp,
})

function SignUp() {
  return (
    <div>
      <h1>Sign Up</h1>
    </div>
  )
}
