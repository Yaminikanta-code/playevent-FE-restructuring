import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button, ConfirmationModal, FormModal, Modal } from '../common'

export const Route = createFileRoute('/modal-test')({
  component: ModalTest,
})

function ModalTest() {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [showHeaderlessModal, setShowHeaderlessModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDelete = () => {
    console.log('Item deleted!')
    // Add your delete logic here
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted!')
      setIsSubmitting(false)
      setShowFormModal(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-midnight-darkest p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-inputs-title mb-8">
          Modal Component Test
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Delete Confirmation Modal Card */}
          <div className="bg-midnight-base border border-midnight-light rounded-lg p-6">
            <h2 className="text-xl font-semibold text-inputs-title mb-4">
              Delete Confirmation Modal
            </h2>
            <p className="text-inputs-text mb-6">
              A modal for confirming destructive actions like deleting items.
              Features customizable title, message, and button text.
            </p>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteModal(true)}
            >
              Open Delete Modal
            </Button>
          </div>

          {/* Form Modal Card */}
          <div className="bg-midnight-base border border-midnight-light rounded-lg p-6">
            <h2 className="text-xl font-semibold text-inputs-title mb-4">
              Form Modal
            </h2>
            <p className="text-inputs-text mb-6">
              A modal for forms with customizable content, submit/cancel
              buttons, and loading states.
            </p>
            <Button variant="primary" onClick={() => setShowFormModal(true)}>
              Open Form Modal
            </Button>
          </div>

          {/* Headerless Modal Card */}
          <div className="bg-midnight-base border border-midnight-light rounded-lg p-6">
            <h2 className="text-xl font-semibold text-inputs-title mb-4">
              Headerless Modal
            </h2>
            <p className="text-inputs-text mb-6">
              A modal without a header section. Close button appears in top
              right corner. No border separator.
            </p>
            <Button
              variant="secondary"
              onClick={() => setShowHeaderlessModal(true)}
            >
              Open Headerless Modal
            </Button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Item"
          message="Are you sure you want to delete this item? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDelete}
          variant="danger"
        />

        {/* Form Modal */}
        <FormModal
          isOpen={showFormModal}
          onClose={() => setShowFormModal(false)}
          title="Create New Item"
          description="Fill in the details below to create a new item."
          submitText="Create"
          cancelText="Cancel"
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-inputs-title mb-2"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter name"
                required
                className="w-full px-4 py-2 bg-inputs-background border border-inputs-border rounded-md text-inputs-title placeholder-inputs-text-off focus:outline-none focus:ring-2 focus:ring-divers-button focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-inputs-title mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email"
                required
                className="w-full px-4 py-2 bg-inputs-background border border-inputs-border rounded-md text-inputs-title placeholder-inputs-text-off focus:outline-none focus:ring-2 focus:ring-divers-button focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-inputs-title mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="w-full px-4 py-2 bg-inputs-background border border-inputs-border rounded-md text-inputs-title placeholder-inputs-text-off focus:outline-none focus:ring-2 focus:ring-divers-button focus:border-transparent transition-all"
                placeholder="Enter description"
              />
            </div>
          </div>
        </FormModal>

        {/* Headerless Modal */}
        <Modal
          isOpen={showHeaderlessModal}
          onClose={() => setShowHeaderlessModal(false)}
          showHeader={false}
          showCloseButton={true}
          size="md"
        >
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-divers-button flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-inputs-title">
              Success!
            </h3>
            <p className="text-inputs-text text-center max-w-md">
              This is a headerless modal with a close button in the top right
              corner. No header border is shown.
            </p>
            <Button
              variant="primary"
              onClick={() => setShowHeaderlessModal(false)}
              className="mt-4"
            >
              Got it!
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  )
}
