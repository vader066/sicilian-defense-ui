import { Spinner } from '@/components/ui/spinner'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-full h-dvh flex items-center justify-center">
      <Spinner size="large" />
    </div>
  )
}
