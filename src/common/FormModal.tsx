import React from 'react'
import Modal, { type ModalProps } from './Modal'
import Button from './Button'

export interface FormModalProps extends Omit<ModalProps, 'size'> {
  title: string
  description?: string
  submitText?: string
  cancelText?: string
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onCancel?: () => void
  isSubmitting?: boolean
  submitDisabled?: boolean
  children: React.ReactNode
  footerActions?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const FormModal: React.FC<FormModalProps> = ({
  title,
  description,
  submitText = 'Submit',
  cancelText = 'Cancel',
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitDisabled = false,
  children,
  footerActions,
  isOpen,
  onClose,
  size = 'md',
  showHeader = true,
  showCloseButton = true,
}) => {
  const handleCancel = () => {
    onCancel?.()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      showHeader={showHeader}
      showCloseButton={showCloseButton}
    >
      <form onSubmit={onSubmit} className="flex flex-col h-full">
        {/* Description */}
        {description && (
          <p className="text-inputs-text text-sm mb-4">{description}</p>
        )}

        {/* Form Content */}
        <div className="flex-1 space-y-4">{children}</div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-midnight-light">
          {footerActions ? (
            footerActions
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                {cancelText}
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                disabled={submitDisabled}
              >
                {submitText}
              </Button>
            </>
          )}
        </div>
      </form>
    </Modal>
  )
}

export default FormModal
