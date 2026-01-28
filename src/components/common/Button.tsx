import React from 'react'
import { Loader2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'destructive'
    | 'success'
    | 'outline'
    | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  isLoading?: boolean
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      icon: Icon,
      iconPosition = 'left',
      isLoading = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const variantStyles = {
      primary:
        'bg-divers-button text-white hover:bg-divers-button/90 focus:ring-divers-button',
      secondary:
        'bg-ink-highlight text-white hover:bg-ink-highlight/90 focus:ring-ink-highlight',
      destructive:
        'bg-ink-error text-white hover:bg-ink-error/90 focus:ring-ink-error',
      success:
        'bg-icons-green text-white hover:bg-icons-green/90 focus:ring-icons-green',
      outline:
        'border-2 border-inputs-border text-inputs-title hover:bg-inputs-background focus:ring-inputs-border',
      ghost:
        'text-inputs-title hover:bg-inputs-background focus:ring-inputs-border',
    }

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm rounded-sm',
      md: 'px-4 py-2 text-base rounded-md',
      lg: 'px-6 py-3 text-lg rounded-lg',
    }

    const iconSize = {
      sm: 16,
      md: 20,
      lg: 24,
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className,
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2
            className={cn(
              'animate-spin',
              iconPosition === 'right' && 'order-2 ml-2',
            )}
            size={iconSize[size]}
          />
        ) : Icon ? (
          <Icon
            className={cn(
              iconPosition === 'right' && 'order-2 ml-2',
              children && iconPosition === 'left' && 'mr-2',
            )}
            size={iconSize[size]}
          />
        ) : null}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'

export default Button
