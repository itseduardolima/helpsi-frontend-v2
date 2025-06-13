"use client";

import { useAuth } from "@/src/hooks/useAuth";
import { Layout } from "@/src/components/Layout";
import { Button } from "@/src/components/ui/button";
import { useUser } from "@/src/hooks/useUser";
import { useScheduling } from "@/src/hooks/useScheduling";
import { SchedulingForm } from "@/src/components/SchedulingForm";
import { Scheduling } from "@/src/types/scheduling";
import { Brain, Calendar, Clock, Heart, MessageSquare, User, LogOut, Bell, Settings } from "lucide-react";

// Função para formatar o nome do usuário
const formatUserName = (name: string) => {
  if (!name) return "";
  const firstName = name.split(" ")[0];
  return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
};

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const { data: userData, isLoading: isLoadingUser } = useUser();
  const { data: schedulings, isLoading: isLoadingSchedulings } = useScheduling({
    patientId: user?.id,
  });

  if (isLoadingUser || isLoadingSchedulings) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-main"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Brain className="w-8 h-8 text-primary-main" />
                <span className="ml-2 text-xl font-semibold text-gray-900">Helpsi</span>
              </div>
              <div className="flex items-center gap-4">
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
                  Olá, {formatUserName(userData?.user_name || "")}!
                </h1>
                <p className="text-gray-600 mt-1">
                  Como você está se sentindo hoje?
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button variant="outline" className="flex items-center justify-center gap-2 w-full sm:w-auto">
                  <User className="w-4 h-4" />
                  Atualizar Perfil
                </Button>
                <SchedulingForm />
              </div>
            </div>

            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                    <Brain className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Sessões Realizadas</p>
                    <p className="text-2xl font-semibold text-gray-900">12</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                    <Heart className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bem-estar</p>
                    <p className="text-2xl font-semibold text-gray-900">85%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Diário Emocional</p>
                    <p className="text-2xl font-semibold text-gray-900">7 dias</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Próxima Sessão</p>
                    <p className="text-2xl font-semibold text-gray-900">2 dias</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Seção Principal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Próximos Agendamentos */}
              <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary-main" />
                    Próximos Agendamentos
                  </h2>
                </div>
                {schedulings && schedulings.length > 0 ? (
                  <div className="space-y-4">
                    {schedulings.map((scheduling: Scheduling) => (
                      <div
                        key={scheduling.id}
                        className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <p className="font-medium text-gray-900">
                              {new Date(scheduling.date).toLocaleDateString("pt-BR")}
                            </p>
                            <p className="text-sm text-gray-600">
                              Horário: {scheduling.time}
                            </p>
                          </div>
                          <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 w-fit">
                            {scheduling.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Nenhum agendamento encontrado</p>
                    <Button variant="outline" className="mt-4">
                      Agendar Consulta
                    </Button>
                  </div>
                )}
              </div>

              {/* Resumo e Atividades */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Resumo da Semana
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Progresso</span>
                      <span className="text-gray-900 font-medium">75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-500" 
                        style={{ width: '75%' }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Continue assim! Você está progredindo bem em suas metas.
                    </p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Atividades Recentes
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                        <MessageSquare className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Diário Emocional Atualizado
                        </p>
                        <p className="text-xs text-gray-600">Há 2 horas</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Nova Sessão Agendada
                        </p>
                        <p className="text-xs text-gray-600">Há 1 dia</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
