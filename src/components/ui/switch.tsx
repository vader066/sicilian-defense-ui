import { cn } from '@/lib/utils'
import * as Switch from '@radix-ui/react-switch'

export default ({
  tClass,
  className,
  ...props
}: Switch.SwitchProps & { tClass?: string }) => (
  <Switch.Root
    className={cn(
      'relative h-[25px] w-[42px] shadow-sm cursor-pointer rounded-full outline-none data-[state=checked]:bg-[#b4ff52] bg-slate-200',
      className,
    )}
    {...props}
  >
    <Switch.Thumb
      className={cn(
        'block size-[21px] translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]',
        tClass,
      )}
    />
  </Switch.Root>
)
