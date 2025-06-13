"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/src/services/auth"
import type { User, LoginCredentials, AuthResponse } from "@/src/types/auth"

interface AuthContextData {
  user: User | null
  signIn: (credentials: LoginCredentials) => Promise<void>
  signOut: () => void
  loading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const isAuthenticated = !!user

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Verificar se temos dados de autenticação
        if (authService.hasValidAuthData()) {
          const storedUser = localStorage.getItem("@Helpsi:user")

          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser) as User
              setUser(parsedUser)
            } catch (parseError) {
              console.error("Error parsing stored user data:", parseError)
              clearAuthData()
            }
          }
        }
      } catch (error) {
        console.error("Error initializing authentication:", error)
        clearAuthData()
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const clearAuthData = () => {
    localStorage.removeItem("@Helpsi:user")
    localStorage.removeItem("@Helpsi:token")
    localStorage.removeItem("@Helpsi:refresh_token")
    setUser(null)
  }

  const signIn = async (credentials: LoginCredentials) => {
    try {
      const response: AuthResponse = await authService.login(credentials)
      const { access_token, refresh_token, name, login, profile, sub } = response

      const userData: User = {
        id: sub,
        name,
        email: login,
        role: profile,
      }

      // Salvar dados no localStorage
      localStorage.setItem("@Helpsi:user", JSON.stringify(userData))
      localStorage.setItem("@Helpsi:token", access_token)

      if (refresh_token) {
        localStorage.setItem("@Helpsi:refresh_token", refresh_token)
      }

      setUser(userData)
      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      clearAuthData()
      router.push("/login")
    }
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading, isAuthenticated }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
