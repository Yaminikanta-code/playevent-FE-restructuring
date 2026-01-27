import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '../lib/utils'

export interface CollapsibleProps {
  /** Title displayed in the header */
  title: string
  /** Action icons to display in the header (up to 4) */
  actions?: React.ReactNode[]
  /** Whether the collapsible is initially expanded */
  defaultExpanded?: boolean
  /** Optional controlled expanded state */
  expanded?: boolean
  /** Callback when expanded state changes */
  onExpandedChange?: (expanded: boolean) => void
  /** Additional CSS classes for the container */
  className?: string
  /** Content to display in the collapsible body */
  children: React.ReactNode
}

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  (
    {
      title,
      actions = [],
      defaultExpanded = false,
      expanded: controlledExpanded,
      onExpandedChange,
      className,
      children,
    },
    ref,
  ) => {
    const [internalExpanded, setInternalExpanded] = useState(defaultExpanded)
    const contentRef = useRef<HTMLDivElement>(null)
    const [contentHeight, setContentHeight] = useState<number | 'auto'>(
      defaultExpanded ? 'auto' : 0,
    )

    // Determine if this is a controlled component
    const isControlled = controlledExpanded !== undefined
    const expanded = isControlled ? controlledExpanded : internalExpanded

    const toggleExpanded = () => {
      const newExpanded = !expanded
      if (!isControlled) {
        setInternalExpanded(newExpanded)
      }
      onExpandedChange?.(newExpanded)
    }

    // Update content height when expanded state changes
    useEffect(() => {
      if (contentRef.current) {
        if (expanded) {
          setContentHeight(contentRef.current.scrollHeight)
          // After animation completes, set to auto to handle dynamic content
          const timeout = setTimeout(() => {
            setContentHeight('auto')
          }, 300)
          return () => clearTimeout(timeout)
        } else {
          setContentHeight(contentRef.current.scrollHeight)
          // Trigger reflow
          requestAnimationFrame(() => {
            setContentHeight(0)
          })
        }
      }
    }, [expanded])

    // Recalculate height when children change
    useEffect(() => {
      if (expanded && contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight)
      }
    }, [children, expanded])

    return (
      <div ref={ref} className={cn('w-full', className)}>
        {/* Header */}
        <div
          onClick={toggleExpanded}
          className="flex items-center justify-between px-4 py-1 cursor-pointer bg-midnight-light hover:bg-midnight-light/90 transition-colors duration-200 rounded-t-md select-none"
        >
          {/* Title on the left */}
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>

          {/* Action icons and chevron on the right */}
          <div className="flex items-center gap-2">
            {/* Action icons container (up to 4) */}
            {actions.length > 0 && (
              <div className="flex items-center gap-1">
                {actions.slice(0, 4).map((action, index) => (
                  <div
                    key={index}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center"
                  >
                    {action}
                  </div>
                ))}
              </div>
            )}

            {/* Chevron icon */}
            {expanded ? (
              <ChevronUp className="text-ink-darkest" size={20} />
            ) : (
              <ChevronDown className="text-ink-darkest" size={20} />
            )}
          </div>
        </div>

        {/* Content area with smooth animation */}
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            height:
              typeof contentHeight === 'number'
                ? `${contentHeight}px`
                : contentHeight,
          }}
        >
          <div
            ref={contentRef}
            className="bg-inputs-background border-x border-b border-inputs-border rounded-b-md"
          >
            <div className="p-4">{children}</div>
          </div>
        </div>
      </div>
    )
  },
)

Collapsible.displayName = 'Collapsible'

export default Collapsible
