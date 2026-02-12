import React from 'react'
import { Controller } from 'react-hook-form'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { cn } from '../../lib/utils'

export interface RadioOption {
  value: string
  label: string
  disabled?: boolean
}

export interface RadioProps<T extends FieldValues = FieldValues> extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'name' | 'type'
> {
  id?: string
  label?: string
  className?: string
  control: Control<T>
  name: Path<T>
  rules?: object
  options: RadioOption[]
  error?: string
  helperText?: string
  orientation?: 'vertical' | 'horizontal'
}

const Radio = <T extends FieldValues = FieldValues>({
  id,
  label = '',
  className = '',
  control,
  name,
  rules = {},
  options,
  error: externalError,
  helperText,
  orientation = 'vertical',
  ...props
}: RadioProps<T>) => {
  const radioId = id || name

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
              <label className="block text-sm font-medium text-inputs-title mb-2">
                {label}
              </label>
            )}
            <div
              className={cn(
                'space-y-3',
                orientation === 'horizontal' &&
                  'flex flex-row space-y-0 space-x-6',
              )}
            >
              {options.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    'flex items-center space-x-3 cursor-pointer',
                    option.disabled && 'opacity-50 cursor-not-allowed',
                  )}
                >
                  <div className="relative flex items-center">
                    <input
                      id={`${radioId}-${option.value}`}
                      data-testid={`${radioId}-${option.value}`}
                      type="radio"
                      className={cn(
                        'peer h-5 w-5 cursor-pointer appearance-none rounded-full border-2',
                        'transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-offset-2',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        hasError
                          ? 'border-ink-error focus:ring-ink-error'
                          : 'border-inputs-border focus:ring-inputs-border',
                        'bg-inputs-background',
                        'checked:border-divers-button',
                      )}
                      {...field}
                      value={option.value}
                      {...props}
                      disabled={option.disabled || props.disabled}
                    />
                    <div
                      className={cn(
                        'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
                        'h-2.5 w-2.5 rounded-full bg-divers-button',
                        'transition-opacity duration-200',
                        'opacity-0 peer-checked:opacity-100',
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      'text-sm font-medium text-inputs-title select-none',
                    )}
                  >
                    {option.label}
                  </span>
                </label>
              ))}
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

Radio.displayName = 'Radio'

export default Radio
