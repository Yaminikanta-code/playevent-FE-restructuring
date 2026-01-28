import { create } from 'zustand'

type Theme = 'dark' | 'light'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedTheme = localStorage.getItem('vite-ui-theme') as Theme
    if (storedTheme) {
      return storedTheme
    }
    // Check for system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
  }
  return 'light' // Default to light if no preference or not in browser
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getInitialTheme(),
  setTheme: (newTheme: Theme) => {
    set(() => {
      localStorage.setItem('vite-ui-theme', newTheme)
      return { theme: newTheme }
    })
  },
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('vite-ui-theme', newTheme)
      return { theme: newTheme }
    }),
}))
