import React from 'react'
import { Controller } from 'react-hook-form'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { cn } from '../lib/utils'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps<T extends FieldValues = FieldValues> extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  'name'
> {
  id?: string
  label?: string
  placeholder?: string
  className?: string
  control: Control<T>
  name: Path<T>
  rules?: object
  options: SelectOption[]
  error?: string
  helperText?: string
}

const Select = <T extends FieldValues = FieldValues>({
  id,
  label = '',
  placeholder = 'Select an option',
  className = '',
  control,
  name,
  rules = {},
  options,
  error: externalError,
  helperText,
  ...props
}: SelectProps<T>) => {
  const selectId = id || name

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
                htmlFor={selectId}
                className="block text-sm font-medium text-inputs-title mb-2"
              >
                {label}
              </label>
            )}
            <select
              id={selectId}
              data-testid={selectId}
              className={cn(
                'flex h-10 w-full px-3 py-2 text-base transition-all duration-200',
                'border-2 rounded-md',
                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'md:text-sm',
                hasError
                  ? 'border-ink-error text-ink-error focus:border-ink-error focus:ring-ink-error'
                  : 'border-inputs-border text-inputs-title focus:border-inputs-border focus:ring-inputs-border',
                'bg-inputs-background',
              )}
              {...field}
              {...props}
            >
              <option value="" disabled>
                {placeholder}
              </option>
              {options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))}
            </select>
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

Select.displayName = 'Select'

export default Select
