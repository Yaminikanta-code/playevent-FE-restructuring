import React from 'react'
import { Loader2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'destructive'
    | 'success'
    | 'outline'
    | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon: LucideIcon
  isLoading?: boolean
  tooltip?: string
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      icon: Icon,
      isLoading = false,
      disabled,
      tooltip,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

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
      sm: 'p-1.5 rounded-sm',
      md: 'p-2 rounded-md',
      lg: 'p-3 rounded-lg',
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
          className,
        )}
        disabled={disabled || isLoading}
        title={tooltip}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={iconSize[size]} />
        ) : (
          <Icon size={iconSize[size]} />
        )}
      </button>
    )
  },
)

IconButton.displayName = 'IconButton'

export default IconButton
