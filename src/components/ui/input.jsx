import { forwardRef } from 'react'
import { cn } from '../../lib/utils.js'

export const inputVariants =
  'h-10 w-full min-w-0 rounded-4xl border border-input bg-input/30 px-4 py-2 text-sm text-foreground transition-colors outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'

const Input = forwardRef(function Input({ className, type = 'text', ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(inputVariants, className)}
      {...props}
    />
  )
})

export { Input }
