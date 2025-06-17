import { DashboardStats, RecentActivity } from "@/src/services/dashboard";
import { Brain, Star, User } from "lucide-react";

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

  // Cards fictícios para psicólogo
  export const psychologistStats = [
    {
      title: "Total de Pacientes",
      value: 18,
      icon: User,
      gradientFrom: "from-blue-50",
      gradientTo: "to-indigo-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Sessões Hoje",
      value: 4,
      icon: Brain,
      gradientFrom: "from-green-50",
      gradientTo: "to-emerald-50",
      iconColor: "text-green-600",
    },
    {
      title: "Sessões no Mês",
      value: 32,
      icon: Brain,
      gradientFrom: "from-orange-50",
      gradientTo: "to-amber-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Avaliações",
      value: "4.9/5",
      icon: Star,
      gradientFrom: "from-yellow-50",
      gradientTo: "to-yellow-100",
      iconColor: "text-yellow-600",
    },
  ];

  export const psychologistActivities = [
    {
      id: "1",
      type: "sessao",
      description: "Sessão realizada com paciente João Silva",
      date: "2024-06-10T10:00:00Z",
    },
    {
      id: "2",
      type: "avaliacao",
      description: "Recebeu avaliação 5 estrelas de Maria Souza",
      date: "2024-06-09T15:30:00Z",
    },
    {
      id: "3",
      type: "sessao",
      description: "Sessão reagendada com paciente Ana Lima",
      date: "2024-06-08T09:00:00Z",
    },
    {
      id: "4",
      type: "novo_paciente",
      description: "Novo paciente cadastrado: Pedro Rocha",
      date: "2024-06-07T14:00:00Z",
    },
  ];