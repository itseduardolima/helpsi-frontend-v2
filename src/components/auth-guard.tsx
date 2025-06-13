"use client"

import type React from "react"
import { useAuth } from "@/src/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader } from "lucide-react"


interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !isAuthenticated) {
        router.push("/login")
      } else if (!requireAuth && isAuthenticated) {
        router.push("/dashboard")
      }
    }
  }, [isAuthenticated, loading, requireAuth, router])

  if (loading) {
    return <Loader />
  }

  // Se requer autenticação mas não está autenticado, mostra loading
  if (requireAuth && !isAuthenticated) {
    return <Loader />
  }

  // Se não requer autenticação mas está autenticado, mostra loading
  if (!requireAuth && isAuthenticated) {
    return <Loader />
  }

  return <>{children}</>
}
