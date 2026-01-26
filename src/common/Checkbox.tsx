import React from 'react'
import { Controller } from 'react-hook-form'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { Check } from 'lucide-react'
import { cn } from '../lib/utils'

export interface CheckboxProps<
  T extends FieldValues = FieldValues,
> extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'type'> {
  id?: string
  label?: string
  className?: string
  control: Control<T>
  name: Path<T>
  rules?: object
  error?: string
  helperText?: string
}

const Checkbox = <T extends FieldValues = FieldValues>({
  id,
  label = '',
  className = '',
  control,
  name,
  rules = {},
  error: externalError,
  helperText,
  ...props
}: CheckboxProps<T>) => {
  const checkboxId = id || name

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        const hasError = fieldState.error || externalError
        const errorMessage = fieldState.error?.message || externalError

        return (
          <div className={cn('flex flex-col', className)}>
            <div className="flex items-start space-x-3">
              <div className="relative flex items-center">
                <input
                  id={checkboxId}
                  data-testid={checkboxId}
                  type="checkbox"
                  className={cn(
                    'peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2',
                    'transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-offset-2',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    hasError
                      ? 'border-ink-error focus:ring-ink-error'
                      : 'border-inputs-border focus:ring-inputs-border',
                    'bg-inputs-background',
                    'checked:bg-divers-button checked:border-divers-button',
                  )}
                  {...field}
                  {...props}
                />
                <Check
                  className={cn(
                    'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
                    'h-3.5 w-3.5 text-white pointer-events-none',
                    'transition-opacity duration-200',
                    'opacity-0 peer-checked:opacity-100',
                  )}
                  strokeWidth={3}
                />
              </div>
              {label && (
                <label
                  htmlFor={checkboxId}
                  className="text-sm font-medium text-inputs-title cursor-pointer select-none"
                >
                  {label}
                </label>
              )}
            </div>
            {hasError && (
              <span className="text-sm text-ink-error mt-1">
                {errorMessage}
              </span>
            )}
            {!hasError && helperText && (
              <span className="text-sm text-inputs-text-off mt-1">
                {helperText}
              </span>
            )}
          </div>
        )
      }}
    />
  )
}

Checkbox.displayName = 'Checkbox'

export default Checkbox
