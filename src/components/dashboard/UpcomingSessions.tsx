"use client"

import { Calendar, Clock, User, Phone, Video, MoreVertical, AlertCircle, CheckCircle } from "lucide-react"
import { format, isPast } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Scheduling } from "@/src/types/scheduling"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { getDateLabel, getTimeUntil } from "@/src/utils/date"

interface UpcomingSessionsProps {
  schedulings: Scheduling[]
  onCancelScheduling?: (schedulingId: string) => void
  onRescheduleScheduling?: (schedulingId: string) => void
}

export function UpcomingSessions({ schedulings, onCancelScheduling, onRescheduleScheduling }: UpcomingSessionsProps) {
  const getStatusBadge = (scheduling: Scheduling) => {
    if (scheduling.isCancelled) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Cancelada
        </Badge>
      )
    }

    const startTime = new Date(scheduling.start_time)
    if (isPast(startTime)) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Concluída
        </Badge>
      )
    }

    return (
      <Badge variant="default" className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-200">
        <Clock className="w-3 h-3" />
        Agendada
      </Badge>
    )
  }


  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Próximos Agendamentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {schedulings && schedulings.length > 0 ? (
          <div className="space-y-4">
            {schedulings.map((scheduling) => {
              const startTime = new Date(scheduling.start_time)
              const endTime = new Date(scheduling.end_time)
              const timeUntil = getTimeUntil(startTime)

              return (
                <div
                  key={scheduling.scheduling_id}
                  className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                    scheduling.isCancelled
                      ? "bg-red-50 border-red-200"
                      : isPast(startTime)
                        ? "bg-gray-50 border-gray-200"
                        : "bg-blue-50 border-blue-200 hover:bg-blue-100"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      {/* Header with status and date */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusBadge(scheduling)}
                          <span className="text-sm  text-gray-600">{getDateLabel(startTime)}</span>
                        </div>
                        {timeUntil && (
                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">{timeUntil}</span>
                        )}
                      </div>

                      {/* Main content */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Date and time info */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className=" text-gray-500">
                              {format(startTime, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-500">
                              {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))} min)
                            </span>
                          </div>
                        </div>

                        {/* Psychologist info */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${scheduling.currentPsychologist.user_name}`}
                              />
                              <AvatarFallback>
                                {scheduling.currentPsychologist.user_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className=" text-gray-900">{scheduling.currentPsychologist.user_name}</p>
                              <p className="text-sm text-gray-600">Psicólogo(a)</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Patient info */}
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Paciente: <span className="">{scheduling.registrant_name}</span>
                        </span>
                      </div>
                    </div>

                    {/* Actions menu */}
                    {!scheduling.isCancelled && !isPast(startTime) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="w-4 h-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Video className="w-4 h-4" />
                            Iniciar Consulta
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Ligar para Paciente
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="flex items-center gap-2"
                            onClick={() => onRescheduleScheduling?.(scheduling.scheduling_id)}
                          >
                            <Calendar className="w-4 h-4" />
                            Reagendar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2 text-red-600"
                            onClick={() => onCancelScheduling?.(scheduling.scheduling_id)}
                          >
                            <AlertCircle className="w-4 h-4" />
                            Cancelar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg  text-gray-900 mb-2">Nenhum agendamento encontrado</h3>
            <p className="text-gray-600 mb-6">Você não possui consultas agendadas no momento.</p>
            <Button className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Agendar Nova Consulta
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
