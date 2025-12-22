import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import TanstackQueryLayout from '../integrations/tanstack-query/layout'

import type { QueryClient } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import type { User } from '@/types/auth'

interface MyRouterContext {
  queryClient: QueryClient
  user: User | null
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Toaster position="top-right" />
      <Outlet />
      <TanStackRouterDevtools />
      <TanstackQueryLayout />
    </>
  ),
})
