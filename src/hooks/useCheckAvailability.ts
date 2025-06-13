
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';


interface CheckAvailabilityParams {
  date: string;
  type: string;
}

export function useCheckAvailability(params: CheckAvailabilityParams) {
  return useQuery({
    queryKey: ['availability', params],
    queryFn: async () => {
      const response = await api.get('/scheduling/availability', {
        params,
      });
      return response.data as string[];
    },
    enabled: !!params.date && !!params.type,
  });
} 