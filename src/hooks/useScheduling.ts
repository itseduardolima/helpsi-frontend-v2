import { useQuery } from '@tanstack/react-query';
import { SchedulingFilter } from '../types/scheduling';
import { schedulingService } from '../services/scheduling';

export function useScheduling(filter: SchedulingFilter) {
  return useQuery({
    queryKey: ['schedulings', filter],
    queryFn: () => schedulingService.findAll(filter),
  });
} 