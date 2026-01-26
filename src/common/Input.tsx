import React from 'react'
import { Controller } from 'react-hook-form'
import type { Control, FieldValues, Path } from 'react-hook-form'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../lib/utils'

export interface InputProps<T extends FieldValues = FieldValues> extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'name'
> {
  id?: string
  label?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  className?: string
  control: Control<T>
  name: Path<T>
  rules?: object
  icon?: LucideIcon
  error?: string
  helperText?: string
}

const Input = <T extends FieldValues = FieldValues>({
  id,
  label = '',
  placeholder = '',
  type = 'text',
  className = '',
  control,
  name,
  rules = {},
  icon: Icon,
  error: externalError,
  helperText,
  ...props
}: InputProps<T>) => {
  const inputId = id || name

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
            {label && (
              <label
                htmlFor={inputId}
                className="block text-sm font-medium text-inputs-title mb-2"
              >
                {label}
              </label>
            )}
            <div className="relative">
              {Icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-inputs-text">
                  <Icon size={20} />
                </div>
              )}
              <input
                id={inputId}
                data-testid={inputId}
                type={type}
                placeholder={placeholder}
                className={cn(
                  'flex h-10 w-full px-3 py-2 text-base transition-all duration-200',
                  'border-2 rounded-md',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  'md:text-sm',
                  Icon && 'pl-10',
                  hasError
                    ? 'border-ink-error text-ink-error focus:border-ink-error focus:ring-ink-error'
                    : 'border-inputs-border text-inputs-title focus:border-inputs-border focus:ring-inputs-border',
                  'bg-inputs-background placeholder:text-inputs-text-off',
                )}
                {...field}
                {...props}
              />
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

Input.displayName = 'Input'

export default Input
