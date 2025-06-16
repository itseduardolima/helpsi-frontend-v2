import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/src/services/dashboard';

export function useDashboard() {
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardService.getStats
  });

  const { data: activities, isLoading: isLoadingActivities } = useQuery({
    queryKey: ['dashboard-activities'],
    queryFn: dashboardService.getRecentActivities
  });

  return {
    stats,
    activities,
    isLoading: isLoadingStats || isLoadingActivities
  };
} 