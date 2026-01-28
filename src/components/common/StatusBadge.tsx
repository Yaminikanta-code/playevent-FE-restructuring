import React from 'react'
import { cn } from '../../lib/utils'

export type BadgeStatusType =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'

export interface StatusBadgeProps {
  status: BadgeStatusType
  label?: string
  className?: string
}

const statusConfig: Record<
  BadgeStatusType,
  {
    bgColor: string
    textColor: string
    defaultLabel: string
  }
> = {
  active: {
    bgColor: 'bg-statuszen-lighest',
    textColor: 'text-statuszen-base',
    defaultLabel: 'Active',
  },
  inactive: {
    bgColor: 'bg-midnight-lighter',
    textColor: 'text-inputs-text',
    defaultLabel: 'Inactive',
  },
  pending: {
    bgColor: 'bg-statusalert-base',
    textColor: 'text-white',
    defaultLabel: 'Pending',
  },
  success: {
    bgColor: 'bg-statuszen-light',
    textColor: 'text-statuszen-darkest',
    defaultLabel: 'Success',
  },
  warning: {
    bgColor: 'bg-statusalert-lightest',
    textColor: 'text-statusalert-dark',
    defaultLabel: 'Warning',
  },
  error: {
    bgColor: 'bg-statusalert-dark',
    textColor: 'text-white',
    defaultLabel: 'Error',
  },
  info: {
    bgColor: 'bg-statusneutral-lightest',
    textColor: 'text-statusneutral-base',
    defaultLabel: 'Info',
  },
}

function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.info

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
        config.bgColor,
        config.textColor,
        className,
      )}
    >
      {label || config.defaultLabel}
    </span>
  )
}

export default StatusBadge
