import React from 'react'
import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'

export interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel?: () => void
  variant?: 'danger' | 'warning' | 'info'
  showHeader?: boolean
  showCloseButton?: boolean
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isOpen,
  onClose,
  variant = 'danger',
  showHeader = true,
  showCloseButton = false,
}) => {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const handleCancel = () => {
    onCancel?.()
    onClose()
  }

  const variantStyles = {
    danger: {
      icon: 'text-ink-error',
      button: 'destructive',
    },
    warning: {
      icon: 'text-ink-alert',
      button: 'secondary',
    },
    info: {
      icon: 'text-divers-button',
      button: 'primary',
    },
  }

  const styles = variantStyles[variant]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      showHeader={showHeader}
      showCloseButton={showCloseButton}
    >
      <div className="flex flex-col items-center text-center space-y-4 py-4">
        {/* Icon */}
        <div className={`p-3 rounded-full bg-midnight-light ${styles.icon}`}>
          <AlertTriangle size={32} />
        </div>

        {/* Message */}
        <p className="text-inputs-text text-base">{message}</p>

        {/* Actions */}
        <div className="flex gap-3 w-full pt-4">
          <Button variant="outline" onClick={handleCancel} className="flex-1">
            {cancelText}
          </Button>
          <Button
            variant={styles.button as any}
            onClick={handleConfirm}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmationModal
