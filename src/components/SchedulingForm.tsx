"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useCreateScheduling, useAvailableTimes } from "../hooks/useScheduling"
import { Calendar, MessageSquare, ArrowLeft } from "lucide-react"
import { Label } from "./ui/label"
import { format, isValid, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarComponent } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { cn } from "@/src/lib/utils"
import { useSpecialties, usePsychologistsBySpecialtyName } from "../hooks/useSpecialty"
import type { Psychologist } from "../types/psychologist"
import type { Specialty } from "../types/specialty"
import { useMe } from "../hooks/useUsers"
import { TimeSlotPicker } from "./dashboard/TimeSlotPicker"


type Step = "specialty" | "psychologist" | "datetime" | "confirm"

export function SchedulingModal() {
  const { data: userData } = useMe()
  const [open, setOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState<Step>("specialty")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [formData, setFormData] = useState({
    duration: 1,
    select_date_time: new Date(),
    patient_id: userData?.user_id || "",
    psychologist_id: "",
    registrant_name: userData?.user_name || "",
    specialty_id: "",
  })

  const { mutate: createScheduling, isPending } = useCreateScheduling()

  const { data: specialties, isLoading: isLoadingSpecialties } = useSpecialties()
  const selectedSpecialtyName = specialties?.find((s) => s.specialty_id === formData.specialty_id)?.specialty_name || ""
  const { data: psychologists, isLoading: isLoadingPsychologists } =
    usePsychologistsBySpecialtyName(selectedSpecialtyName)
  const { data: availableTimes, isLoading: isLoadingAvailability } = useAvailableTimes(
    formData.select_date_time,
    formData.psychologist_id,
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createScheduling(formData, {
      onSuccess: () => {
        setOpen(false)
        setCurrentStep("specialty")
        setSelectedTime("")
        setFormData({
          duration: 1,
          select_date_time: new Date(),
          patient_id: userData?.user_id || "",
          psychologist_id: "",
          registrant_name: userData?.user_name || "",
          specialty_id: "",
        })
      },
    })
  }

  const handleTimeSelection = (timeString: string) => {
    setSelectedTime(timeString)
    try {
      const selectedDateTime = parseISO(timeString)
      setFormData({ ...formData, select_date_time: selectedDateTime })
    } catch (error) {
      console.error("Error parsing selected time:", error)
    }
  }

  const canProceedToConfirm = selectedTime && formData.select_date_time && isValid(formData.select_date_time)

  const renderStep = () => {
    switch (currentStep) {
      case "specialty":
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <MessageSquare className="w-12 h-12 mx-auto text-primary-main mb-2" />
              <h3 className="text-lg font-medium">Qual tipo de consulta você deseja?</h3>
              <p className="text-sm text-gray-500 mt-1">Selecione a especialidade para continuar</p>
            </div>
            <Select
              value={formData.specialty_id}
              onValueChange={(value) => {
                setFormData({ ...formData, specialty_id: value })
                setCurrentStep("psychologist")
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a especialidade" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingSpecialties ? (
                  <SelectItem value="loading" disabled>
                    Carregando especialidades...
                  </SelectItem>
                ) : (specialties || []).length > 0 ? (
                  (specialties || []).map((specialty) => (
                    <SelectItem key={specialty.specialty_id} value={specialty.specialty_id}>
                      {specialty.specialty_name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    Nenhuma especialidade disponível
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        )

      case "psychologist":
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <MessageSquare className="w-12 h-12 mx-auto text-primary-main mb-2" />
              <h3 className="text-lg font-medium">Escolha o profissional</h3>
              <p className="text-sm text-gray-500 mt-1">Selecione o psicólogo para sua consulta</p>
            </div>
            <Select
              value={formData.psychologist_id}
              onValueChange={(value) => {
                setFormData({ ...formData, psychologist_id: value })
                setCurrentStep("datetime")
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o psicólogo" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingPsychologists ? (
                  <SelectItem value="loading" disabled>
                    Carregando psicólogos...
                  </SelectItem>
                ) : Array.isArray(psychologists) && psychologists.length > 0 ? (
                  psychologists.map((psychologist: Psychologist) => (
                    <SelectItem key={psychologist.user_id} value={psychologist.user_id}>
                      {psychologist.user_name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    Nenhum psicólogo disponível
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <Button type="button" variant="outline" className="w-full" onClick={() => setCurrentStep("specialty")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>
        )

      case "datetime":
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Calendar className="w-12 h-12 mx-auto text-primary-main mb-2" />
              <h3 className="text-lg font-medium">Escolha a data e horário</h3>
              <p className="text-sm text-gray-500 mt-1">Selecione quando deseja realizar sua consulta</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium">Data</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-2 h-12",
                        !formData.select_date_time && "text-muted-foreground",
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {formData.select_date_time && isValid(formData.select_date_time) ? (
                        format(formData.select_date_time, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={formData.select_date_time}
                      onSelect={(date) => {
                        if (date) {
                          setSelectedTime("")
                          setFormData({ ...formData, select_date_time: date })
                        }
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label className="text-base font-medium">Horário Disponível</Label>
                <div className="mt-2">
                  <TimeSlotPicker
                    availableTimes={availableTimes || []}
                    selectedTime={selectedTime}
                    onTimeSelect={handleTimeSelection}
                    isLoading={isLoadingAvailability}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setCurrentStep("psychologist")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button
                type="button"
                className="flex-1"
                disabled={!canProceedToConfirm}
                onClick={() => setCurrentStep("confirm")}
              >
                Continuar
              </Button>
            </div>
          </div>
        )

      case "confirm":
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <MessageSquare className="w-12 h-12 mx-auto text-primary-main mb-2" />
              <h3 className="text-lg font-medium">Confirmar Agendamento</h3>
              <p className="text-sm text-gray-500 mt-1">Revise os detalhes da sua consulta</p>
            </div>
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <Label className="text-sm text-gray-500">Especialidade</Label>
                <p className="font-medium">
                  {specialties?.find((s: Specialty) => s.specialty_id === formData.specialty_id)?.specialty_name}
                </p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Profissional</Label>
                <p className="font-medium">
                  {psychologists?.find((p: Psychologist) => p.user_id === formData.psychologist_id)?.user_name}
                </p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Data e Hora</Label>
                <p className="font-medium">
                  {isValid(formData.select_date_time)
                    ? format(formData.select_date_time, "PPP 'às' HH:mm", { locale: ptBR })
                    : "Data inválida"}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setCurrentStep("datetime")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button type="submit" className="flex-1" disabled={isPending}>
                {isPending ? "Agendando..." : "Confirmar"}
              </Button>
            </div>
          </div>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Novo Agendamento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Agendar Consulta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4">
          {renderStep()}
        </form>
      </DialogContent>
    </Dialog>
  )
}
