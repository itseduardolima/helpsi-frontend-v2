import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export interface Specialty {
  specialty_id: string;
  specialty_name: string;
}

export function useSpecialties() {
  return useQuery<Specialty[]>({
    queryKey: ['specialties'],
    queryFn: async () => {
      const response = await api.get<Specialty[]>('/specialty');
      return response.data;
    }
  });
}

export function usePsychologistsBySpecialty(specialtyId: string) {
  return useQuery<Psychologist[]>({
    queryKey: ['psychologists', specialtyId],
    queryFn: async () => {
      if (!specialtyId) return [];
      const response = await api.get<{ items: Psychologist[] }>('/users', {
        params: {
          specialty_id: specialtyId,
          user_profile_id: '3'
        }
      });
      return response.data.items;
    },
    enabled: !!specialtyId
  });
}

interface Psychologist {
  user_id: string;
  user_name: string;
} 