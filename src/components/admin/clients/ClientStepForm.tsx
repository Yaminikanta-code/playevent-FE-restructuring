import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { X } from 'lucide-react'
import {
  ConfirmationModal,
  IconButton,
  ScrollArea,
  StepIndicator,
} from '../../common'
import type { Step } from '../../common/StepIndicator'
import { useUpdateTenant } from '../../../api/tenant.api'
import { useClientGroups } from '../../../api/group.api'
import type { TenantOutDto } from '../../../types/tenant.types'
import type { GroupOutDto } from '../../../types/group.types'
import ClientForm from './ClientForm'
import UserForm from '../users/UserForm'
import ContractForm from '../contracts/ContractForm'
import AppShellForm from '../appShells/AppShellForm'

const STEPS: Step[] = [
  { label: 'Client' },
  { label: 'Users' },
  { label: 'Contracts' },
  { label: 'Shells' },
]

const STEP_KEYS = ['client', 'users', 'contracts', 'shells'] as const

function stepKeyToIndex(key: string | undefined | null): number {
  if (!key) return 0
  const idx = STEP_KEYS.indexOf(key as (typeof STEP_KEYS)[number])
  return idx >= 0 ? idx : 0
}

function completedStepsFromKey(key: string | undefined | null): number[] {
  const idx = stepKeyToIndex(key)
  return Array.from({ length: idx }, (_, i) => i)
}

interface ClientStepFormProps {
  existingClient?: TenantOutDto | null
  onClose?: () => void
}

const ClientStepForm = ({
  existingClient,
  onClose,
}: ClientStepFormProps) => {
  const navigate = useNavigate()

  const initialStep = existingClient
    ? stepKeyToIndex(existingClient.creation_step)
    : 0
  const initialCompleted = existingClient
    ? completedStepsFromKey(existingClient.creation_step)
    : []

  const [currentStep, setCurrentStep] = useState(initialStep)
  const [completedSteps, setCompletedSteps] = useState<number[]>(initialCompleted)
  const [clientId, setClientId] = useState<string | null>(
    existingClient?.id ?? null,
  )
  const [clientName, setClientName] = useState<string>(
    existingClient?.name ?? '',
  )
  const [showCancelModal, setShowCancelModal] = useState(false)

  // Fetch groups for this client (used by UserForm and ContractForm)
  const { data: groupData } = useClientGroups(clientId ?? '')
  const clientGroups: GroupOutDto[] = useMemo(
    () => groupData?.data ?? [],
    [groupData],
  )

  const updateTenantMutation = useUpdateTenant()

  // --- Step helpers ---

  const markStepCompleted = useCallback((stepIndex: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepIndex) ? prev : [...prev, stepIndex],
    )
  }, [])

  const updateCreationStep = useCallback(
    async (id: string, stepKey: string) => {
      try {
        await updateTenantMutation.mutateAsync({
          id,
          data: { creation_step: stepKey },
        })
      } catch {
        // Non-critical
      }
    },
    [updateTenantMutation],
  )

  // Step 1 callback: Client created
  const handleClientSuccess = useCallback(
    (newClientId: string, name: string) => {
      setClientId(newClientId)
      setClientName(name)
      markStepCompleted(0)
      setCurrentStep(1)
    },
    [markStepCompleted],
  )

  // Step navigation callbacks
  const handleUserSuccess = useCallback(async () => {
    if (clientId) {
      await updateCreationStep(clientId, 'contracts')
    }
    markStepCompleted(1)
    setCurrentStep(2)
  }, [clientId, updateCreationStep, markStepCompleted])

  const handleContractSuccess = useCallback(async () => {
    if (clientId) {
      await updateCreationStep(clientId, 'shells')
    }
    markStepCompleted(2)
    setCurrentStep(3)
  }, [clientId, updateCreationStep, markStepCompleted])

  const handleShellSuccess = useCallback(async () => {
    if (clientId) {
      await updateCreationStep(clientId, 'completed')
    }
    markStepCompleted(3)
    navigate({ to: '/admin/clients' })
  }, [clientId, updateCreationStep, markStepCompleted, navigate])

  const handleStepClick = (stepIndex: number) => {
    if (
      completedSteps.includes(stepIndex) ||
      stepIndex <= Math.max(...completedSteps, -1) + 1
    ) {
      setCurrentStep(stepIndex)
    }
  }

  const handleClose = () => {
    setShowCancelModal(true)
  }

  const handleConfirmClose = () => {
    setShowCancelModal(false)
    onClose?.() || navigate({ to: '/admin/clients' })
  }

  // --- Render steps ---
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ClientForm
            existingClient={existingClient}
            onSubmitSuccess={handleClientSuccess}
          />
        )
      case 1:
        return clientId ? (
          <UserForm
            tenants={[]}
            allGroups={clientGroups}
            mode="new"
            embedded
            clientId={clientId}
            onSubmitSuccess={handleUserSuccess}
            submitLabel="Add a contract >>"
          />
        ) : null
      case 2:
        return clientId ? (
          <ContractForm
            tenants={[]}
            allGroups={clientGroups}
            mode="new"
            embedded
            clientId={clientId}
            onSubmitSuccess={handleContractSuccess}
            submitLabel="Add a shell >>"
          />
        ) : null
      case 3:
        return clientId ? (
          <AppShellForm
            tenants={[]}
            mode="new"
            embedded
            clientId={clientId}
            onSubmitSuccess={handleShellSuccess}
            submitLabel="Complete Setup"
          />
        ) : null
      default:
        return null
    }
  }

  return (
    <div className="h-[90vh]">
      <ScrollArea
        title={clientName || 'New Client'}
        headerActions={
          <IconButton
            icon={X}
            variant="ghost"
            size="md"
            tooltip="Close"
            onClick={handleClose}
          />
        }
        headerContent={
          <StepIndicator
            steps={STEPS}
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={handleStepClick}
          />
        }
      >
        {renderStep()}
      </ScrollArea>

      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Setup"
        message="Are you sure you want to cancel the client setup? Any progress on the current step will be lost."
        confirmText="Cancel Setup"
        cancelText="Continue Setup"
        onConfirm={handleConfirmClose}
        variant="warning"
      />
    </div>
  )
}

export default ClientStepForm
