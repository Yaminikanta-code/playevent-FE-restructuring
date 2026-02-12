import React, { useState, useRef, useEffect } from 'react'
import { Controller } from 'react-hook-form'
import type { Control, FieldValues, Path } from 'react-hook-form'
import type { LucideIcon } from 'lucide-react'
import { HexAlphaColorPicker } from 'react-colorful'
import { cn } from '../../lib/utils'

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
  const [pickerPosition, setPickerPosition] = useState<'top' | 'bottom'>('top')

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

  // Check screen position and adjust picker placement
  useEffect(() => {
    if (isPickerOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top
      const pickerHeight = 320 // Approximate height of the picker

      // If there's not enough space below but enough above, open upwards
      if (spaceBelow < pickerHeight && spaceAbove >= pickerHeight) {
        setPickerPosition('top')
      } else {
        // Default to bottom if there's space, otherwise use whichever has more space
        setPickerPosition(spaceBelow >= spaceAbove ? 'bottom' : 'top')
      }
    }
  }, [isPickerOpen])

  // Convert hex to rgba for opacity calculation
  const hexToRgba = (hex: string) => {
    const result =
      /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex)
    if (!result) return { r: 0, g: 0, b: 0, a: 1 }
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
      a: result[4] ? parseInt(result[4], 16) / 255 : 1,
    }
  }

  const getOpacityPercentage = (hex: string) => {
    const rgba = hexToRgba(hex)
    return Math.round(rgba.a * 100)
  }

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
        const opacity = getOpacityPercentage(value)
        const colorWithoutAlpha =
          value.length >= 7 ? value.substring(0, 7) : value

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

              {/* Enhanced Color picker popover - Now opens up by default */}
              {isPickerOpen && (
                <div
                  ref={pickerRef}
                  className={cn(
                    'absolute z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-3',
                    pickerPosition === 'top'
                      ? 'bottom-full mb-2' // Positions above the input
                      : 'top-full mt-2', // Fallback: positions below the input
                  )}
                  style={{ width: '260px' }}
                >
                  {/* Main color picker area */}
                  <div className="relative w-full" style={{ height: '220px' }}>
                    <HexAlphaColorPicker
                      color={value || '#000000FF'}
                      onChange={handleColorChange}
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  </div>

                  {/* Custom CSS to make sliders thinner and add spacing */}
                  <style>{`
                    .react-colorful__hue,
                    .react-colorful__alpha {
                      height: 10px !important;
                      border-radius: 5px !important;
                      margin-top: 12px !important;
                    }
                    
                    .react-colorful__pointer {
                      width: 18px !important;
                      height: 18px !important;
                    }
                    
                    .react-colorful__saturation {
                      border-radius: 8px !important;
                      margin-bottom: 4px !important;
                    }
                  `}</style>

                  {/* Color inputs */}
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1 flex flex-wrap items-center gap-2">
                      <input
                        type="text"
                        value={colorWithoutAlpha.toUpperCase()}
                        onChange={(e) => {
                          const newColor = e.target.value
                          if (/^#[0-9A-F]{0,6}$/i.test(newColor)) {
                            const alpha =
                              value.length === 9 ? value.substring(7, 9) : 'FF'
                            handleColorChange(newColor + alpha)
                          }
                        }}
                        className="w-36 px-3 py-2 text-gray-900 border border-gray-300 rounded-lg text-sm font-mono bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      <div className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                        <input
                          type="text"
                          value={opacity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0
                            const clampedVal = Math.max(0, Math.min(100, val))
                            const alphaHex = Math.round(
                              (clampedVal / 100) * 255,
                            )
                              .toString(16)
                              .padStart(2, '0')
                            const baseColor =
                              value.length >= 7
                                ? value.substring(0, 7)
                                : '#000000'
                            handleColorChange(baseColor + alphaHex)
                          }}
                          className="w-10 text-sm text-gray-900 font-medium bg-transparent border-none outline-none text-right"
                        />
                        <span className="text-sm text-gray-500">%</span>
                      </div>
                    </div>
                  </div>
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
