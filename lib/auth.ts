"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  email: string
  role: "admin" | "moderator" | "viewer"
  name: string
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  checkAuth: () => boolean
}

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // Mock authentication - replace with real auth service
        if (email === "admin@corrumap.org" && password === "admin123") {
          const user: User = {
            id: "1",
            email: "admin@corrumap.org",
            role: "admin",
            name: "Admin User",
          }
          set({ user, isAuthenticated: true })
          return true
        }
        return false
      },
      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
      checkAuth: () => {
        const { user } = get()
        return !!user
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)
