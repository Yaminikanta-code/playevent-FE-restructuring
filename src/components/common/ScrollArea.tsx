import React from 'react'
import { cn } from '../../lib/utils'

export interface ScrollAreaProps {
  /** Title displayed in the header */
  title: string
  /** Action icons/buttons to display on the right side of the header */
  headerActions?: React.ReactNode
  /** Content to display below the header (e.g., tabs, filters) */
  headerContent?: React.ReactNode
  /** Maximum height of the scroll area. If not set, fills parent container */
  maxHeight?: string | number
  /** Additional CSS classes for the outer container */
  className?: string
  /** Additional CSS classes for the scrollable content area */
  contentClassName?: string
  /** Content to display in the scrollable area */
  children: React.ReactNode
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      title,
      headerActions,
      headerContent,
      maxHeight,
      className,
      contentClassName,
      children,
    },
    ref,
  ) => {
    const maxHeightStyle =
      typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col w-full h-full bg-midnight-base border border-inputs-border rounded-lg overflow-hidden',
          className,
        )}
        style={maxHeight ? { maxHeight: maxHeightStyle } : undefined}
      >
        {/* Header area */}
        <div className="shrink-0">
          {/* Title row */}
          <div className="flex items-center justify-between px-6 pt-5 pb-3">
            <h2 className="text-title-1 text-inputs-title">{title}</h2>
            {headerActions && (
              <div className="flex items-center gap-3">{headerActions}</div>
            )}
          </div>

          {/* Optional header content (tabs, filters, etc.) */}
          {headerContent && <div className="px-6 pb-4">{headerContent}</div>}
        </div>

        {/* Scrollable content area */}
        <div
          className={cn('flex-1 overflow-y-auto px-6 pb-6', contentClassName)}
        >
          {children}
        </div>
      </div>
    )
  },
)

ScrollArea.displayName = 'ScrollArea'

export default ScrollArea
