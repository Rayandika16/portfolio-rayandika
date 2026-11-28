import { forwardRef } from 'react'
import { cn } from '../../lib/utils.js'

export const textareaVariants =
  'flex min-h-24 w-full rounded-xl border border-input bg-input/30 px-4 py-3 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50'

const Textarea = forwardRef(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={cn(textareaVariants, className)}
      {...props}
    />
  )
})

export { Textarea }
