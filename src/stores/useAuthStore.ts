import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  is_super_admin: boolean
  role: string | null
}

export interface UserPayload {
  access_token: string
  token_type: string
  user: User
}

interface AuthState {
  user: User | null
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
