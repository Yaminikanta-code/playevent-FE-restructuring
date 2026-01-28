import React from 'react'
import { Controller } from 'react-hook-form'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { cn } from '../../lib/utils'

export interface TextareaProps<
  T extends FieldValues = FieldValues,
> extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'> {
  id?: string
  label?: string
  placeholder?: string
  className?: string
  control: Control<T>
  name: Path<T>
  rules?: object
  error?: string
  helperText?: string
  rows?: number
  resize?: 'none' | 'both' | 'horizontal' | 'vertical'
}

const Textarea = <T extends FieldValues = FieldValues>({
  id,
  label = '',
  placeholder = '',
  className = '',
  control,
  name,
  rules = {},
  error: externalError,
  helperText,
  rows = 4,
  resize = 'vertical',
  ...props
}: TextareaProps<T>) => {
  const textareaId = id || name

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        const hasError = fieldState.error || externalError
        const errorMessage = fieldState.error?.message || externalError
        const isRequired =
          rules && typeof rules === 'object' && 'required' in rules
        const descriptionId = `${textareaId}-description`
        const hasDescription = hasError || helperText

        return (
          <div className={cn('flex flex-col', className)}>
            {label && (
              <label
                htmlFor={textareaId}
                className="block text-sm font-medium text-inputs-title mb-2"
              >
                {label}
                {isRequired && <span className="text-ink-error ml-1">*</span>}
              </label>
            )}
            <textarea
              id={textareaId}
              data-testid={textareaId}
              placeholder={placeholder}
              rows={rows}
              className={cn(
                'flex w-full px-3 py-2 text-base transition-all duration-200',
                'border-2 rounded-md',
                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'md:text-sm',
                hasError
                  ? 'border-ink-error text-ink-error focus:border-ink-error focus:ring-ink-error'
                  : 'border-inputs-border text-inputs-title focus:border-inputs-border focus:ring-inputs-border',
                'bg-inputs-background placeholder:text-inputs-text-off',
                resize === 'none' && 'resize-none',
                resize === 'both' && 'resize',
                resize === 'horizontal' && 'resize-x',
                resize === 'vertical' && 'resize-y',
              )}
              aria-invalid={hasError ? 'true' : 'false'}
              aria-required={isRequired ? 'true' : undefined}
              aria-describedby={hasDescription ? descriptionId : undefined}
              {...field}
              {...props}
            />
            {hasError && (
              <span id={descriptionId} className="text-sm text-ink-error mt-1">
                {errorMessage}
              </span>
            )}
            {!hasError && helperText && (
              <span
                id={descriptionId}
                className="text-sm text-inputs-text-off mt-1"
              >
                {helperText}
              </span>
            )}
          </div>
        )
      }}
    />
  )
}

Textarea.displayName = 'Textarea'

export default Textarea
