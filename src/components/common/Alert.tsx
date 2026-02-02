import { useEffect, useState } from 'react'
import { useAlertStore } from '@/stores/useAlertStore'
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react'

export function Alert() {
  const { message, type, hideAlert } = useAlertStore()
  const [isVisible, setIsVisible] = useState(false)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (message) {
      setIsVisible(true)
      setProgress(100)

      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.max(0, prev - 1))
      }, 20)

      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => hideAlert(), 300) // Wait for animation to complete
      }, 2000)

      return () => {
        clearInterval(progressInterval)
        clearTimeout(timer)
      }
    }
  }, [message, hideAlert])

  if (!message) return null

  const alertConfig = {
    success: {
      icon: CheckCircle2,
      background: 'group bg-green-50 border border-green-200',
      text: 'text-green-800',
      iconColor: 'text-green-600',
      closeColor: 'text-green-600 hover:text-green-800',
      ring: 'focus:ring-green-500',
    },
    error: {
      icon: XCircle,
      background: 'group bg-red-50 border border-red-200',
      text: 'text-red-800',
      iconColor: 'text-red-600',
      closeColor: 'text-red-600 hover:text-red-800',
      ring: 'focus:ring-red-500',
    },
    warning: {
      icon: AlertTriangle,
      background: 'group bg-yellow-50 border border-yellow-200',
      text: 'text-yellow-800',
      iconColor: 'text-yellow-600',
      closeColor: 'text-yellow-600 hover:text-yellow-800',
      ring: 'focus:ring-yellow-500',
    },
    info: {
      icon: Info,
      background: 'group bg-blue-50 border border-blue-200',
      text: 'text-blue-800',
      iconColor: 'text-blue-600',
      closeColor: 'text-blue-600 hover:text-blue-800',
      ring: 'focus:ring-blue-500',
    },
  }

  const config =
    alertConfig[type as keyof typeof alertConfig] || alertConfig.info

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-sm w-full">
      <div
        className={`
        transition-all duration-300 ease-out
        ${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-full'
        }
      `}
      >
        <div
          className={`rounded-lg p-3 shadow-lg backdrop-blur-sm ${config.background} ${config.text}`}
        >
          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 ${config.iconColor}`}>
              <config.icon className="h-4 w-4 mt-0.5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium leading-5">{message}</div>
            </div>

            <button
              onClick={() => {
                setIsVisible(false)
                setTimeout(() => hideAlert(), 300)
              }}
              className={`flex-shrink-0 rounded-sm opacity-70 transition-all duration-200 hover:opacity-100 hover:bg-black/5 p-1 ${config.closeColor} ${config.ring}`}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-current/20 rounded-b-lg overflow-hidden">
            <div
              className="h-full bg-current/40 transition-all duration-200 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Alert
