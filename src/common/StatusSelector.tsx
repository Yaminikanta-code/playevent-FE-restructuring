import React from 'react'
import { Controller } from 'react-hook-form'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { cn } from '../lib/utils'

export type StatusType =
  | 'available'
  | 'busy'
  | 'away'
  | 'offline'
  | 'alert'
  | 'success'
  | 'neutral'

export interface StatusOption {
  value: StatusType
  label: string
  colorClass: string
}

export const statusOptions: StatusOption[] = [
  { value: 'available', label: 'Available', colorClass: 'bg-statuszen-base' },
  { value: 'busy', label: 'Busy', colorClass: 'bg-statusalert-base' },
  { value: 'away', label: 'Away', colorClass: 'bg-statusneutral-base' },
  {
    value: 'offline',
    label: 'Offline',
    colorClass: 'bg-statusneutral-darkest',
  },
  { value: 'alert', label: 'Alert', colorClass: 'bg-statusalert-base' },
  { value: 'success', label: 'Success', colorClass: 'bg-statuszen-base' },
  { value: 'neutral', label: 'Neutral', colorClass: 'bg-statusneutral-base' },
]

export interface StatusSelectorProps<T extends FieldValues = FieldValues> {
  id?: string
  label?: string
  className?: string
  control: Control<T>
  name: Path<T>
  rules?: object
  error?: string
  helperText?: string
  options?: StatusOption[]
  disabled?: boolean
}

const StatusSelector = <T extends FieldValues = FieldValues>({
  id,
  label = '',
  className = '',
  control,
  name,
  rules = {},
  error: externalError,
  helperText,
  options = statusOptions,
  disabled = false,
}: StatusSelectorProps<T>) => {
  const selectorId = id || name

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        const hasError = fieldState.error || externalError
        const errorMessage = fieldState.error?.message || externalError
        const selectedOption = options.find((opt) => opt.value === field.value)

        return (
          <div className={cn('flex flex-col', className)}>
            {label && (
              <label
                htmlFor={selectorId}
                className="block text-sm font-medium text-inputs-title mb-3"
              >
                {label}
              </label>
            )}

            {/* Select Dropdown with Applied Styles */}
            <div className="relative">
              <select
                id={selectorId}
                data-testid={selectorId}
                className={cn(
                  'flex h-10 w-full px-3 py-2 text-base transition-all duration-200',
                  'border-2 rounded-md',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  'md:text-sm',
                  'appearance-none cursor-pointer',
                  disabled && 'cursor-not-allowed',
                  // Apply status color styling when a status is selected
                  selectedOption
                    ? cn(
                        selectedOption.colorClass,
                        'text-white border-transparent',
                        'hover:opacity-90',
                      )
                    : cn(
                        'border-inputs-border text-inputs-title',
                        'bg-inputs-background',
                        'hover:border-inputs-border/80',
                      ),
                  hasError && !selectedOption
                    ? 'border-ink-error text-ink-error focus:border-ink-error focus:ring-ink-error'
                    : '',
                )}
                {...field}
                disabled={disabled}
              >
                <option value="" disabled>
                  Select status
                </option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Custom dropdown arrow - white when status selected, dark when not */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className={cn(
                    'w-4 h-4',
                    selectedOption ? 'text-white' : 'text-inputs-text',
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {hasError && (
              <span className="text-sm text-ink-error mt-2">
                {errorMessage}
              </span>
            )}
            {!hasError && helperText && (
              <span className="text-sm text-inputs-text-off mt-2">
                {helperText}
              </span>
            )}
          </div>
        )
      }}
    />
  )
}

StatusSelector.displayName = 'StatusSelector'

export default StatusSelector
