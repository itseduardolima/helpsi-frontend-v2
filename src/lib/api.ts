import axios from "axios"

interface RefreshTokenResponse {
  access_token: string
  refresh_token?: string
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
})

// Request interceptor
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("@Helpsi:token")
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Response interceptor para lidar com tokens expirados
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (typeof window !== "undefined") {
        try {
          const refreshToken = localStorage.getItem("@Helpsi:refresh_token")
          if (refreshToken) {
            // Tentar renovar o token
            const { data } = await axios.post<RefreshTokenResponse>(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh_token`, {
              refresh_token: refreshToken,
            })

            // Salvar novos tokens
            localStorage.setItem("@Helpsi:token", data.access_token)
            if (data.refresh_token) {
              localStorage.setItem("@Helpsi:refresh_token", data.refresh_token)
            }

            // Repetir requisição original com novo token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${data.access_token}`
            }
            return api(originalRequest)
          }
        } catch (refreshError) {
          console.error("Failed to refresh token:", refreshError)
        }

        // Se chegou aqui, não conseguiu renovar o token
        localStorage.removeItem("@Helpsi:user")
        localStorage.removeItem("@Helpsi:token")
        localStorage.removeItem("@Helpsi:refresh_token")

        // Redirecionar apenas se não estivermos já na página de login
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login"
        }
      }
    }

    return Promise.reject(error)
  },
)

export default api
