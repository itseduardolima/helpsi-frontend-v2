import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SchedulingFilter } from '../types/scheduling';
import { schedulingService } from '../services/scheduling';
import api from "../lib/api";
import { format } from "date-fns";

export function useScheduling(filter: SchedulingFilter) {
  return useQuery({
    queryKey: ['schedulings', filter],
    queryFn: () => schedulingService.findAll(filter),
  });
}

export interface AvailableTime {
  time: string;
}

export function useAvailableTimes(date: Date, psychologistId: string) {
  return useQuery<AvailableTime[]>({
    queryKey: ['availability', date, psychologistId],
    queryFn: async () => {
      if (!date || !psychologistId) return [];
      const response = await api.get<AvailableTime[]>('/scheduling/availability', {
        params: {
          date: format(date, 'yyyy-MM-dd'),
          psychologist_id: psychologistId
        }
      });
      return response.data;
    },
    enabled: !!date && !!psychologistId
  });
}

export function useCreateScheduling() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/scheduling", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedulings"] });
    },
  });
} 