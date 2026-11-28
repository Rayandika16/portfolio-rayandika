import { forwardRef } from 'react'
import { cn } from '../../lib/utils.js'

const Card = forwardRef(function Card({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      data-slot="card"
      className={cn(
        'group/card flex flex-col gap-6 overflow-hidden rounded-2xl bg-card py-6 text-sm text-card-foreground ring-1 ring-foreground/10',
        className
      )}
      {...props}
    />
  )
})

const CardHeader = forwardRef(function CardHeader({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn('grid auto-rows-min items-start gap-1.5 px-6', className)}
      {...props}
    />
  )
})

const CardTitle = forwardRef(function CardTitle({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      data-slot="card-title"
      className={cn('text-base font-semibold leading-snug text-card-foreground', className)}
      {...props}
    />
  )
})

const CardDescription = forwardRef(function CardDescription({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      data-slot="card-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
})

const CardContent = forwardRef(function CardContent({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      data-slot="card-content"
      className={cn('px-6', className)}
      {...props}
    />
  )
})

const CardFooter = forwardRef(function CardFooter({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      data-slot="card-footer"
      className={cn('flex items-center px-6', className)}
      {...props}
    />
  )
})

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
