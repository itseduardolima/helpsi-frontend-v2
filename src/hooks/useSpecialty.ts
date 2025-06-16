import { useQuery } from "@tanstack/react-query"
import api from "../lib/api"
import type { Psychologist } from "../types/psychologist"

export interface Specialty {
  specialty_id: string
  specialty_name: string
}

export function useSpecialties() {
  return useQuery<Specialty[]>({
    queryKey: ["specialties"],
    queryFn: async () => {
      const response = await api.get<Specialty[]>("/specialty")
      return response.data
    },
  })
}

export function usePsychologistsBySpecialtyName(specialtyName: string) {
  return useQuery({
    queryKey: ["psychologists-by-specialty", specialtyName],
    queryFn: async () => {
      if (!specialtyName) return []

      try {
        const response = await api.get<Psychologist[]>(`/specialty/psychologist-by-specialty`, {
          params: { specialty: specialtyName },
        })
        return response.data || []
      } catch (error) {
        console.error("Error fetching psychologists by specialty:", error)
        return []
      }
    },
    enabled: !!specialtyName,
    initialData: [],
  })
}
