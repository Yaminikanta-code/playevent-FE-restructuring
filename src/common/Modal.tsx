import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '../lib/utils'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showHeader?: boolean
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  className?: string
}

const sizeStyles = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-6xl',
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      children,
      size = 'md',
      showHeader = true,
      showCloseButton = true,
      closeOnOverlayClick = true,
      closeOnEscape = true,
      className,
    },
    ref,
  ) => {
    const modalRef = useRef<HTMLDivElement>(null)
    const previousActiveElement = useRef<HTMLElement | null>(null)

    // Handle escape key
    useEffect(() => {
      if (!closeOnEscape) return

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) {
          onClose()
        }
      }

      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, onClose, closeOnEscape])

    // Focus management
    useEffect(() => {
      if (isOpen) {
        previousActiveElement.current = document.activeElement as HTMLElement
        modalRef.current?.focus()
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
        previousActiveElement.current?.focus()
      }

      return () => {
        document.body.style.overflow = ''
      }
    }, [isOpen])

    // Handle click outside
    const handleOverlayClick = (e: React.MouseEvent) => {
      if (closeOnOverlayClick && e.target === e.currentTarget) {
        onClose()
      }
    }

    if (!isOpen) return null

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />

        {/* Modal */}
        <div
          ref={(node) => {
            modalRef.current = node
            if (typeof ref === 'function') {
              ref(node)
            } else if (ref) {
              ref.current = node
            }
          }}
          className={cn(
            'relative w-full bg-midnight-base border border-midnight-light rounded-lg shadow-2xl',
            'transform transition-all duration-200',
            'max-h-[90vh] flex flex-col',
            sizeStyles[size],
            className,
          )}
          tabIndex={-1}
        >
          {/* Header */}
          {showHeader && (title || showCloseButton) && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-midnight-light">
              {title && (
                <h2
                  id="modal-title"
                  className="text-xl font-semibold text-inputs-title"
                >
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-1 rounded-md text-inputs-text hover:bg-midnight-light hover:text-inputs-title transition-colors"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          )}

          {/* Close button for headerless modals */}
          {!showHeader && showCloseButton && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-md text-inputs-text hover:bg-midnight-light hover:text-inputs-title transition-colors z-10"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
        </div>
      </div>
    )
  },
)

Modal.displayName = 'Modal'

export default Modal
