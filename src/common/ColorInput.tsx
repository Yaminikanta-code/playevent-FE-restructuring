import React, { useState, useRef, useEffect } from 'react'
import { Controller } from 'react-hook-form'
import type { Control, FieldValues, Path } from 'react-hook-form'
import type { LucideIcon } from 'lucide-react'
import { HexAlphaColorPicker } from 'react-colorful'
import { cn } from '../lib/utils'

export interface ColorInputProps<
  T extends FieldValues = FieldValues,
> extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'name' | 'type' | 'value' | 'onChange'
> {
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
  dotSize?: number
  showOpacity?: boolean
}

const ColorInput = <T extends FieldValues = FieldValues>({
  id,
  label = '',
  placeholder = '#000000FF',
  className = '',
  control,
  name,
  rules = {},
  icon: Icon,
  error: externalError,
  helperText,
  dotSize = 20,
  showOpacity = true,
  ...props
}: ColorInputProps<T>) => {
  const inputId = id || name
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsPickerOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        const hasError = fieldState.error || externalError
        const errorMessage = fieldState.error?.message || externalError
        const value = field.value || ''

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          field.onChange(e.target.value)
        }

        const handleColorChange = (color: string) => {
          field.onChange(color)
        }

        const togglePicker = () => {
          setIsPickerOpen(!isPickerOpen)
        }

        const paddingLeft = Icon ? 40 : dotSize + 16

        return (
          <div className={cn('flex flex-col', className)} ref={containerRef}>
            {label && (
              <label
                htmlFor={inputId}
                className="block text-sm font-medium text-inputs-title mb-2"
              >
                {label}
              </label>
            )}
            <div className="relative flex items-center">
              {Icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-inputs-text">
                  <Icon size={20} />
                </div>
              )}
              {/* Color dot */}
              <button
                type="button"
                onClick={togglePicker}
                className={cn(
                  'absolute left-3 top-1/2 -translate-y-1/2',
                  'rounded-full border-2 border-inputs-border',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-inputs-border',
                  'transition-all duration-200',
                  'cursor-pointer',
                  Icon && 'left-10',
                )}
                style={{
                  width: dotSize,
                  height: dotSize,
                  backgroundColor: value || '#000000',
                }}
                aria-label="Pick color"
              />
              <input
                id={inputId}
                data-testid={inputId}
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={handleInputChange}
                style={{ paddingLeft: `${paddingLeft}px` }}
                className={cn(
                  'flex h-10 w-full pr-3 py-2 text-base transition-all duration-200',
                  'border-2 rounded-md',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  'md:text-sm',
                  hasError
                    ? 'border-ink-error text-ink-error focus:border-ink-error focus:ring-ink-error'
                    : 'border-inputs-border text-inputs-title focus:border-inputs-border focus:ring-inputs-border',
                  'bg-inputs-background placeholder:text-inputs-text-off',
                )}
                {...props}
              />

              {/* Color picker popover */}
              {isPickerOpen && (
                <div
                  ref={pickerRef}
                  className="absolute left-0 top-full mt-2 z-50 bg-inputs-background border-2 border-inputs-border rounded-md shadow-lg p-4"
                  style={{ minWidth: '220px' }}
                >
                  <HexAlphaColorPicker
                    color={value || '#000000'}
                    onChange={handleColorChange}
                  />
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-sm text-inputs-text">Color</span>
                    <span className="text-sm text-inputs-title font-mono">
                      {value}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPickerOpen(false)}
                    className="mt-3 w-full py-2 text-sm bg-inputs-border text-inputs-title rounded-md hover:bg-inputs-border-off transition-colors"
                  >
                    Select
                  </button>
                </div>
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

ColorInput.displayName = 'ColorInput'

export default ColorInput
