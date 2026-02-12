import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserOut } from '../types/auth.types'

export interface UserPayload {
  access_token: string
  token_type: string
  user: UserOut
}

interface AuthState {
  user: UserOut | null
  access_token: string | null
  login: (userPayload: UserPayload) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      access_token: null,
      login: (userPayload) =>
        set({
          user: userPayload.user,
          access_token: userPayload.access_token,
        }),
      logout: () => set({ user: null, access_token: null }),
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        user: state.user,
        access_token: state.access_token,
      }),
    },
  ),
)
