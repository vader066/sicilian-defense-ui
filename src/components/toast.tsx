import { cva, type VariantProps } from 'class-variance-authority'
import { toast as sonnerToast } from 'sonner'

import { cn } from '@/lib/utils'
import GreenCheck from './icons/check-green'
import ErrorIcon from './icons/error'
import Warning from './icons/warning'

const ToastVariants = cva('', {
  variants: {
    variant: {
      error: 'bg-[#d62417]',
      warning: 'bg-[#e0c110]',
      success: 'bg-[#00c853]',
    },
  },
  defaultVariants: {
    variant: 'error',
  },
})

export interface toastProps extends VariantProps<typeof ToastVariants> {
  title: string
  description: string
}

export const Toast = ({ title, description, variant }: toastProps) => {
  return (
    <div
      className={cn(
        'relative w-full max-w-xs overflow-hidden rounded-lg shadow-lg',
        variant,
      )}
    >
      {/* Green background layer */}
      <div className={cn(ToastVariants({ variant }), 'absolute inset-0')}></div>

      {/* Black translucent overlay */}
      <div className="relative bg-black/85 p-4 px-2">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full',
              variant,
            )}
          >
            {variant == 'success' && <GreenCheck />}
            {variant == 'error' && <ErrorIcon />}
            {variant == 'warning' && <Warning />}
          </div>
          <div className="flex-1 ">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-[#a3c9c0] text-wrap text-sm">{description}</p>
          </div>
        </div>
      </div>

      {/* Green accent line at bottom */}
      <div
        className={cn(
          ToastVariants({ variant }),
          'absolute bottom-0 left-0 right-0 h-1',
        )}
      ></div>
    </div>
  )
}

function toast(toast: toastProps) {
  return sonnerToast.custom(() => (
    <Toast
      variant={toast.variant}
      title={toast.title}
      description={toast.description}
    />
  ))
}

export { toast, ToastVariants }
