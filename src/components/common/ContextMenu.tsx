import React, { useState, useRef, useEffect } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface ContextMenuItem {
  icon?: LucideIcon
  label: string
  onClick: () => void
  disabled?: boolean
  destructive?: boolean
}

export interface ContextMenuProps {
  items: ContextMenuItem[]
  trigger: React.ReactNode
  className?: string
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
  offset?: number
  onOpen?: () => void
  onClose?: () => void
}

const ContextMenu = React.forwardRef<HTMLDivElement, ContextMenuProps>(
  (
    {
      items,
      trigger,
      className,
      position = 'bottom-left',
      offset = 8,
      onOpen,
      onClose,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const toggleMenu = () => {
      setIsOpen((prev) => {
        const newState = !prev
        if (newState) onOpen?.()
        else onClose?.()
        return newState
      })
    }

    const closeMenu = () => {
      setIsOpen(false)
      onClose?.()
    }

    const handleItemClick = (item: ContextMenuItem) => {
      if (!item.disabled) {
        item.onClick()
        closeMenu()
      }
    }

    // Close on click outside, escape, or scroll
    useEffect(() => {
      if (!isOpen) return

      const handleClickOutside = (e: MouseEvent) => {
        if (!containerRef.current?.contains(e.target as Node)) {
          closeMenu()
        }
      }

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeMenu()
      }

      const handleScroll = () => closeMenu()

      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
      window.addEventListener('scroll', handleScroll, true)

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleEscape)
        window.removeEventListener('scroll', handleScroll, true)
      }
    }, [isOpen])

    // Position mapping to CSS classes
    const positionClasses = {
      'bottom-left': 'top-full left-0',
      'bottom-right': 'top-full right-0',
      'top-left': 'bottom-full left-0',
      'top-right': 'bottom-full right-0',
    }

    return (
      <div className="relative inline-block" ref={ref || containerRef}>
        <div onClick={toggleMenu} className="cursor-pointer">
          {trigger}
        </div>

        {isOpen && (
          <div
            className={cn(
              'absolute z-50 min-w-[200px] max-w-xs rounded-md border border-inputs-border bg-ink-grey shadow-lg py-1',
              positionClasses[position],
              className,
            )}
            style={{
              marginTop: position.startsWith('bottom') ? offset : -offset,
            }}
            role="menu"
          >
            {items.map((item, index) => {
              const Icon = item.icon
              return (
                <button
                  key={index}
                  onClick={() => handleItemClick(item)}
                  disabled={item.disabled}
                  className={cn(
                    'flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors',
                    'focus:outline-none focus:bg-inputs-background-off',
                    item.disabled
                      ? 'cursor-not-allowed opacity-50'
                      : 'cursor-pointer hover:bg-inputs-background-off',
                    item.destructive && 'text-ink-error hover:bg-ink-error/10',
                  )}
                  style={{
                    color: item.destructive ? undefined : '#000000',
                  }}
                  role="menuitem"
                >
                  {Icon && <Icon size={16} />}
                  <span className="flex-1">{item.label}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  },
)

ContextMenu.displayName = 'ContextMenu'

export default ContextMenu
