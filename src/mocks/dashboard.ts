import { DashboardStats, RecentActivity } from "@/src/services/dashboard";

export const mockDashboardStats: DashboardStats = {
  sessionsCompleted: 12,
  wellbeingPercentage: 85,
  emotionalDiaryDays: 7,
  nextSessionDays: 2
};

export const mockRecentActivities: RecentActivity[] = [
  {
    id: "1",
    type: "diary",
    title: "Diário Emocional Atualizado",
    timestamp: "Há 2 horas"
  },
  {
    id: "2",
    type: "scheduling",
    title: "Nova Sessão Agendada",
    timestamp: "Há 1 dia"
  },
  {
    id: "3",
    type: "diary",
    title: "Reflexão Semanal Registrada",
    timestamp: "Há 3 dias"
  },
  {
    id: "4",
    type: "scheduling",
    title: "Sessão Confirmada",
    timestamp: "Há 4 dias"
  }
]; 