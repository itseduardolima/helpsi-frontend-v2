import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';


interface CreateSchedulingDto {
  duration: number;
  select_date_time: Date;
  patient_id: string;
  psychologist_id: string;
  registrant_name: string;
}

export function useCreateScheduling() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSchedulingDto) => {
      const response = await api.post("/scheduling", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedulings'] });
    },
  });
} 