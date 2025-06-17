"use client";

import { useAuth } from "@/src/hooks/useAuth";
import { Layout } from "@/src/components/Layout";
import { Button } from "@/src/components/ui/button";
import { useScheduling } from "@/src/hooks/useScheduling";
import {  SchedulingModal } from "@/src/components/SchedulingForm";
import { Brain, User, LogOut, Bell, Settings, Shield } from "lucide-react";
import Link from "next/link";
import { useDashboard } from "@/src/hooks/useDashboard";
import { StatsCard } from "@/src/components/dashboard/StatsCard";
import { RecentActivities } from "@/src/components/dashboard/RecentActivities";
import { UpcomingSessions } from "@/src/components/dashboard/UpcomingSessions";
import { useMe } from "@/src/hooks/useUsers";
import { getFirstName } from "@/src/utils/format-string";
import { useState } from "react";
import { psychologistActivities, psychologistStats } from "@/src/mocks/dashboard";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function DashboardPage() {
  const { signOut, user} = useAuth();
  const { data: userData, isLoading: isLoadingUser } = useMe();
  const [page, setPage] = useState(1);
  const limit = 2;
  const { stats, activities } = useDashboard();
  const isPsychologist = user?.role === "PSYCHOLOGIST";
  const schedulingFilter = isPsychologist
    ? { psychologist_id: userData?.user_id, page, limit }
    : { patient_id: userData?.user_id, page, limit };

  const { data, isLoading } = useScheduling(schedulingFilter);



  if (isLoadingUser || isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <header className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Brain className="w-8 h-8 text-primary-main" />
                <span className="ml-2 text-xl font-semibold text-gray-900">Helpsi</span>
              </div>
              <div className="flex items-center gap-4">
                {userData?.profile?.profile_name === "ADMIN" && (
                  <Link href="/admin/users">
                    <Button variant="ghost" size="icon" className="relative">
                      <Shield className="w-5 h-5 text-primary-main" />
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="w-5 h-5 text-gray-600" />
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={signOut}
                  className="flex items-center gap-2 text-gray-600 hover:text-red-600"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Header com Boas-vindas */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Olá, {getFirstName(userData?.user_name || "")}!
                </h1>
                <p className="text-gray-600 mt-1">
                  {isPsychologist
                    ? "Aqui estão seus próximos agendamentos e estatísticas do consultório."
                    : "Como você está se sentindo hoje?"}
                </p>
              </div>
              {!isPsychologist && (
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button variant="outline" className="flex items-center justify-center gap-2 w-full sm:w-auto">
                    <User className="w-4 h-4" />
                    Atualizar Perfil
                  </Button>
                  <SchedulingModal />
                </div>
              )}
            </div>

            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {isPsychologist
                ? psychologistStats.map((stat) => (
                    <StatsCard key={stat.title} {...stat} />
                  ))
                : (
                  <>
                    <StatsCard
                      title="Sessões Realizadas"
                      value={stats?.sessionsCompleted || 0}
                      icon={Brain}
                      gradientFrom="from-blue-50"
                      gradientTo="to-indigo-50"
                      iconColor="text-blue-600"
                    />
                    <StatsCard
                      title="Bem-estar"
                      value={`${stats?.wellbeingPercentage || 0}%`}
                      icon={Brain}
                      gradientFrom="from-purple-50"
                      gradientTo="to-pink-50"
                      iconColor="text-purple-600"
                    />
                    <StatsCard
                      title="Diário Emocional"
                      value={`${stats?.emotionalDiaryDays || 0} dias`}
                      icon={Brain}
                      gradientFrom="from-green-50"
                      gradientTo="to-emerald-50"
                      iconColor="text-green-600"
                    />
                    <StatsCard
                      title="Próxima Sessão"
                      value={`${stats?.nextSessionDays || 0} dias`}
                      icon={Brain}
                      gradientFrom="from-orange-50"
                      gradientTo="to-amber-50"
                      iconColor="text-orange-600"
                    />
                  </>
                )
              }
            </div>

            {/* Seção Principal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <UpcomingSessions 
                schedulings={data?.items || []}
                meta={data}
                onPageChange={setPage}
              />
              <RecentActivities
                activities={
                  isPsychologist
                    ? psychologistActivities.map(a => ({
                        id: a.id,
                        type: a.type as "diary" | "scheduling",
                        title: a.description,
                        timestamp: format(new Date(a.date), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })
                      }))
                    : (activities || [])
                }
              />
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}