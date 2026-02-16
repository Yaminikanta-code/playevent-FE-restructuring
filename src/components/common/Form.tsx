import React from 'react'
import { FormProvider as RHFormProvider } from 'react-hook-form'
import type { UseFormReturn, FieldValues } from 'react-hook-form'
import { cn } from '../../lib/utils'

export interface FormProps<T extends FieldValues = FieldValues> extends Omit<
  React.HTMLAttributes<HTMLFormElement>,
  'onSubmit'
> {
  form: UseFormReturn<T>
  onSubmit?: (data: T) => void | Promise<void>
  children: React.ReactNode
}

const Form = <T extends FieldValues = FieldValues>({
  form,
  onSubmit,
  children,
  className,
  ...props
}: FormProps<T>) => {
  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await onSubmit?.(data)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  })

  return (
    <RHFormProvider {...form}>
      <form
        onSubmit={handleSubmit}
        className={cn('space-y-6', className)}
        {...props}
      >
        {children}
      </form>
    </RHFormProvider>
  )
}

Form.displayName = 'Form'

export default Form
