import type { LoginCredentials, AuthResponse } from "@/src/types/auth"
import api from "../lib/api"


export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/login", credentials)
      return response.data
    } catch (error) {
      console.error("Login service error:", error)
      throw error
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout")
    } catch (error) {
      // Ignore logout errors, just clear local data
      console.warn("Logout request failed:", error)
    }
  },

  // Método para verificar se temos dados de autenticação válidos
  hasValidAuthData(): boolean {
    if (typeof window === "undefined") return false

    const token = localStorage.getItem("@Helpsi:token")
    const user = localStorage.getItem("@Helpsi:user")

    return !!(token && user)
  },
}
