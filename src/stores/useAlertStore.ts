import { create } from 'zustand'

export type AlertType = 'success' | 'error' | 'info' | 'warning'

interface AlertState {
  message: string
  type: AlertType
  showAlert: (payload: { message: string; type: AlertType }) => void
  hideAlert: () => void
}

export const useAlertStore = create<AlertState>((set) => ({
  message: '',
  type: 'info',
  showAlert: (payload) =>
    set({
      message: payload.message,
      type: payload.type,
    }),
  hideAlert: () => set({ message: '', type: 'info' }),
}))
