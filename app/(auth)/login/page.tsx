"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/src/hooks/useAuth"
import { AuthGuard } from "@/src/components/auth-guard"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/src/components/ui/card"
import { Brain, Lock, Mail, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import BackgroundImage from "@/public/images/psychology-bg.jpg"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await signIn({ email, password })
    } catch (err) {
      setError("Email ou senha inválidos")
      console.error("Erro no login:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen flex">
        {/* Lado esquerdo - Imagem */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          
          <Image
            src={BackgroundImage}
            alt="Psicologia e bem-estar mental"
            fill
            className="object-cover"
            priority
          />
          
        </div>

        {/* Lado direito - Formulário */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
          <div className="w-full max-w-md">
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="space-y-3">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100">
                    <Brain className="w-8 h-8 text-indigo-600" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-center text-gray-800">Bem-vindo(a)</CardTitle>
                <CardDescription className="text-center text-gray-600">
                  Entre com suas credenciais para acessar sua conta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10 bg-white/50 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10 pr-10 bg-white/50 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Link 
                      href="/esqueci-senha" 
                      className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      Esqueceu sua senha?
                    </Link>
                  </div>

                  {error && (
                    <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-100">
                      {error}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 transform hover:scale-[1.02]" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Entrando...
                      </div>
                    ) : (
                      "Entrar"
                    )}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center border-t pt-6">
                <p className="text-sm text-gray-600">
                  Não tem uma conta?{" "}
                  <Link 
                    href="/cadastro" 
                    className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                  >
                    Cadastre-se
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
