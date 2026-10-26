'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Plan = 'free' | 'pro'

export interface User {
  id: string
  email: string
  name: string
  plan: Plan
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  upgradeToPro: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Demo: accept any email/password combo
        set({
          user: {
            id: Math.random().toString(36).slice(2),
            email,
            name: email.split('@')[0],
            plan: 'free',
            createdAt: new Date().toISOString(),
          },
          isAuthenticated: true,
        })
      },

      signup: async (email: string, password: string, name: string) => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        set({
          user: {
            id: Math.random().toString(36).slice(2),
            email,
            name,
            plan: 'free',
            createdAt: new Date().toISOString(),
          },
          isAuthenticated: true,
        })
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      upgradeToPro: () => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                plan: 'pro',
              }
            : null,
        }))
      },
    }),
    {
      name: 'examsharp-auth',
    }
  )
)
