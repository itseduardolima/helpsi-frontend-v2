import { useMutation, useQueryClient } from '@tanstack/react-query';
import { schedulingService } from '@/src/services/scheduling';
import type { CreateSchedulingDto } from '@/src/types/scheduling';

export function useCreateScheduling() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSchedulingDto) => schedulingService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedulings'] });
    },
  });
} 