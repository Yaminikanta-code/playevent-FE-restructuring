import { cn } from '@/lib/utils'

export interface Step {
  label: string
}

export interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
  completedSteps?: number[]
  onStepClick?: (stepIndex: number) => void
}

const StepIndicator = ({
  steps,
  currentStep,
  completedSteps = [],
  onStepClick,
}: StepIndicatorProps) => {
  return (
    <div className="flex bg-midnight-darkest rounded-md p-1">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(index)
        const isCurrent = index === currentStep
        const isClickable =
          onStepClick &&
          (isCompleted || index <= Math.max(...completedSteps, -1) + 1)

        return (
          <button
            key={index}
            type="button"
            onClick={() => isClickable && onStepClick?.(index)}
            disabled={!isClickable}
            className={cn(
              'flex-1 px-6 py-2 rounded-md text-sm font-medium transition-all',
              isCurrent && 'bg-midnight-light text-inputs-title',
              isCompleted &&
                !isCurrent &&
                'bg-statuszen-base/15 text-statuszen-base hover:bg-statuszen-base/25',
              !isCurrent &&
                !isCompleted &&
                'text-inputs-text',
              isClickable && !isCurrent && 'cursor-pointer hover:text-inputs-title',
              !isClickable && 'cursor-default opacity-50',
            )}
          >
            {step.label}
          </button>
        )
      })}
    </div>
  )
}

export default StepIndicator
