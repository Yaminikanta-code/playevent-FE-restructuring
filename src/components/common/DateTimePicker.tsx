import React from 'react'
import { Controller } from 'react-hook-form'
import type { Control, FieldValues, Path } from 'react-hook-form'
import type { LucideIcon } from 'lucide-react'
import { CalendarClock } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface DateTimePickerProps<
  T extends FieldValues = FieldValues,
> extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'type'> {
  id?: string
  label?: string
  placeholder?: string
  className?: string
  control: Control<T>
  name: Path<T>
  rules?: object
  icon?: LucideIcon
  error?: string
  helperText?: string
  min?: string
  max?: string
  step?: string | number
}

const DateTimePicker = <T extends FieldValues = FieldValues>({
  id,
  label = '',
  placeholder = '',
  className = '',
  control,
  name,
  rules = {},
  icon: Icon = CalendarClock,
  error: externalError,
  helperText,
  min,
  max,
  step,
  ...props
}: DateTimePickerProps<T>) => {
  const inputId = id || name

  const handleIconClick = () => {
    if (props.disabled) return
    const input = document.getElementById(inputId) as HTMLInputElement | null
    if (input) {
      input.focus()
      // Show the browser's datetime picker if supported
      input.showPicker?.()
    }
  }

  const handleIconKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleIconClick()
    }
  }

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
        const descriptionId = `${inputId}-description`
        const hasDescription = hasError || helperText

        return (
          <div className={cn('flex flex-col', className)}>
            {label && (
              <label
                htmlFor={inputId}
                className="block text-sm font-medium text-inputs-title mb-2"
              >
                {label}
                {isRequired && <span className="text-ink-error ml-1">*</span>}
              </label>
            )}
            <div className="relative">
              <button
                type="button"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-inputs-text cursor-pointer bg-transparent border-none p-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-inputs-border rounded-sm"
                onClick={handleIconClick}
                onKeyDown={handleIconKeyDown}
                disabled={props.disabled}
                aria-label="Open date time picker"
                tabIndex={props.disabled ? -1 : 0}
              >
                <Icon size={20} />
              </button>
              <input
                id={inputId}
                data-testid={inputId}
                type="datetime-local"
                placeholder={placeholder}
                className={cn(
                  'flex h-10 w-full px-3 py-2 text-base transition-all duration-200',
                  'border-2 rounded-md',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  'md:text-sm',
                  'pl-10', // Always padding left for icon
                  hasError
                    ? 'border-ink-error text-ink-error focus:border-ink-error focus:ring-ink-error'
                    : 'border-inputs-border text-inputs-title focus:border-inputs-border focus:ring-inputs-border',
                  'bg-inputs-background placeholder:text-inputs-text-off',
                  'appearance-none', // Remove default browser styling
                )}
                min={min}
                max={max}
                step={step}
                aria-invalid={hasError ? 'true' : 'false'}
                aria-required={isRequired ? 'true' : undefined}
                aria-describedby={hasDescription ? descriptionId : undefined}
                {...field}
                {...props}
              />
            </div>
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

DateTimePicker.displayName = 'DateTimePicker'

export default DateTimePicker
