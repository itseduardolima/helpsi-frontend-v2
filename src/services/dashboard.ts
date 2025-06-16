import { mockDashboardStats, mockRecentActivities } from '@/src/mocks/dashboard';

export interface DashboardStats {
  sessionsCompleted: number;
  wellbeingPercentage: number;
  emotionalDiaryDays: number;
  nextSessionDays: number;
}

export interface RecentActivity {
  id: string;
  type: 'diary' | 'scheduling';
  title: string;
  timestamp: string;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    // Simulando um delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockDashboardStats;
  },

  async getRecentActivities(): Promise<RecentActivity[]> {
    // Simulando um delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockRecentActivities;
  }
}; 