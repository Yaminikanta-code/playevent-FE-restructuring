import React from 'react'
import { Controller } from 'react-hook-form'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { cn } from '../../lib/utils'
import Select, { type SelectOption } from './Select'

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

  // Convert StatusOption[] to SelectOption[]
  const selectOptions: SelectOption[] = options.map((option) => ({
    value: option.value,
    label: option.label,
    disabled: false,
  }))

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        const hasError = fieldState.error || externalError
        const errorMessage = fieldState.error?.message || externalError
        const selectedOption = options.find((opt) => opt.value === field.value)

        // Determine trigger className based on selected status
        const triggerClassName = selectedOption
          ? cn(
              selectedOption.colorClass,
              'text-white border-transparent',
              'hover:opacity-90',
              hasError &&
                'border-ink-error text-ink-error focus:border-ink-error focus:ring-ink-error',
            )
          : hasError
            ? 'border-ink-error text-ink-error focus:border-ink-error focus:ring-ink-error'
            : ''

        return (
          <Select
            id={selectorId}
            label={label}
            className={className}
            triggerClassName={triggerClassName}
            control={control}
            name={name}
            rules={rules}
            options={selectOptions}
            error={errorMessage}
            helperText={helperText}
            disabled={disabled}
            placeholder="Select status"
          />
        )
      }}
    />
  )
}

StatusSelector.displayName = 'StatusSelector'

export default StatusSelector
