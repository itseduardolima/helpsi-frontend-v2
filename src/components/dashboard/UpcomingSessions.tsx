import { Calendar } from "lucide-react";
import { Scheduling } from "@/src/types/scheduling";
import { Button } from "@/src/components/ui/button";

interface UpcomingSessionsProps {
  schedulings: Scheduling[];
}

export function UpcomingSessions({ schedulings }: UpcomingSessionsProps) {
  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-main" />
          Próximos Agendamentos
        </h2>
      </div>
      {schedulings && schedulings.length > 0 ? (
        <div className="space-y-4">
          {schedulings.map((scheduling) => (
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
  );
} 