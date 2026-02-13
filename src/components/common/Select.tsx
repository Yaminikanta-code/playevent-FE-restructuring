import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Controller } from 'react-hook-form'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '../../lib/utils'

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
  triggerClassName?: string
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
  triggerClassName = '',
  control,
  name,
  rules = {},
  options,
  error: externalError,
  helperText,
  disabled,
}: SelectProps<T>) => {
  const selectId = id || name
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({})

  const updateDropdownPosition = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    setDropdownStyle({
      position: 'fixed',
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    })
  }, [])

  // Update position when open
  useEffect(() => {
    if (!isOpen) return
    updateDropdownPosition()

    const handleScrollOrResize = () => updateDropdownPosition()
    window.addEventListener('scroll', handleScrollOrResize, true)
    window.addEventListener('resize', handleScrollOrResize)
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true)
      window.removeEventListener('resize', handleScrollOrResize)
    }
  }, [isOpen, updateDropdownPosition])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        const hasError = fieldState.error || externalError
        const errorMessage = fieldState.error?.message || externalError

        const selectedOption = options.find((opt) => opt.value === field.value)
        const displayValue = selectedOption ? selectedOption.label : placeholder

        return (
          <div
            className={cn('flex flex-col relative', className)}
            ref={containerRef}
          >
            {label && (
              <label
                htmlFor={selectId}
                className="block text-sm font-medium text-inputs-title mb-2"
              >
                {label}
              </label>
            )}

            {/* Custom Select Trigger */}
            <button
              type="button"
              ref={triggerRef}
              id={selectId}
              data-testid={selectId}
              className={cn(
                'flex h-10 w-full px-3 py-2 text-base items-center justify-between transition-all duration-200',
                'border-2 rounded-md',
                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'md:text-sm',
                hasError
                  ? 'border-ink-error text-ink-error focus:border-ink-error focus:ring-ink-error'
                  : 'border-inputs-border text-inputs-title focus:border-inputs-border focus:ring-inputs-border',
                'bg-inputs-background hover:bg-inputs-background-off',
                isOpen &&
                  !hasError &&
                  'border-ink-highlight ring-2 ring-ink-highlight/20',
                triggerClassName,
              )}
              onClick={() => !disabled && setIsOpen(!isOpen)}
              disabled={disabled}
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              aria-labelledby={`${selectId}-label`}
            >
              <span
                className={cn(
                  'truncate',
                  !field.value && 'text-inputs-text-off',
                )}
              >
                {displayValue}
              </span>
              <ChevronDown
                size={20}
                className={cn(
                  'text-inputs-text transition-transform duration-200',
                  isOpen && 'rotate-180',
                )}
              />
            </button>

            {/* Custom Dropdown - portaled to body to escape overflow-hidden ancestors */}
            {isOpen &&
              createPortal(
                <div
                  ref={dropdownRef}
                  className="z-50 max-h-64 overflow-y-auto rounded-lg border border-inputs-border bg-inputs-background shadow-2xl"
                  style={dropdownStyle}
                  role="listbox"
                  aria-labelledby={`${selectId}-label`}
                >
                  {options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={cn(
                        'flex w-full items-center justify-between px-4 py-3 text-left transition-colors duration-150',
                        'hover:bg-midnight-light focus:bg-midnight-light focus:outline-none',
                        option.disabled && 'cursor-not-allowed opacity-50',
                        field.value === option.value &&
                          'bg-midnight-light text-ink-highlight',
                      )}
                      onClick={() => {
                        if (!option.disabled) {
                          field.onChange(option.value)
                          setIsOpen(false)
                        }
                      }}
                      disabled={option.disabled}
                      role="option"
                      aria-selected={field.value === option.value}
                    >
                      <span
                        className={cn(
                          'text-inputs-title',
                          field.value === option.value && 'font-medium',
                        )}
                      >
                        {option.label}
                      </span>
                      {field.value === option.value && (
                        <Check size={18} className="text-ink-highlight" />
                      )}
                    </button>
                  ))}
                </div>,
                document.body,
              )}

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
