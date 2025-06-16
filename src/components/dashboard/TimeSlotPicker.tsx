"use client"


import { Clock, Sun, Sunset, Moon } from "lucide-react"
import { format, parseISO } from "date-fns"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"

interface TimeSlot {
  time: string
  displayTime: string
  period: "morning" | "afternoon" | "evening"
}

interface TimeSlotPickerProps {
  availableTimes: { time: string }[]
  selectedTime: string
  onTimeSelect: (time: string) => void
  isLoading?: boolean
}

export function TimeSlotPicker({ availableTimes, selectedTime, onTimeSelect, isLoading }: TimeSlotPickerProps) {
  const parseTimeSlots = (times: { time: string }[]): TimeSlot[] => {
    return times
      .map((timeObj) => {
        try {
          const date = parseISO(timeObj.time)
          const displayTime = format(date, "HH:mm")
          const hour = date.getHours()

          let period: "morning" | "afternoon" | "evening"
          if (hour < 12) {
            period = "morning"
          } else if (hour < 18) {
            period = "afternoon"
          } else {
            period = "evening"
          }

          return {
            time: timeObj.time,
            displayTime,
            period,
          }
        } catch (error) {
          console.error("Error parsing time:", timeObj.time, error)
          return null
        }
      })
      .filter((slot): slot is TimeSlot => slot !== null)
      .sort((a, b) => a.displayTime.localeCompare(b.displayTime))
  }

  const timeSlots = parseTimeSlots(availableTimes || [])

  const groupedSlots = {
    morning: timeSlots.filter((slot) => slot.period === "morning"),
    afternoon: timeSlots.filter((slot) => slot.period === "afternoon"),
    evening: timeSlots.filter((slot) => slot.period === "evening"),
  }

  const getPeriodInfo = (period: "morning" | "afternoon" | "evening") => {
    switch (period) {
      case "morning":
        return { label: "Manhã", icon: Sun, color: "text-yellow-600" }
      case "afternoon":
        return { label: "Tarde", icon: Sunset, color: "text-orange-600" }
      case "evening":
        return { label: "Noite", icon: Moon, color: "text-blue-600" }
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4 animate-spin" />
          Carregando horários disponíveis...
        </div>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded-md animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (timeSlots.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <Clock className="w-8 h-8 mx-auto text-gray-400 mb-2" />
        <p className="text-gray-600 font-medium">Nenhum horário disponível</p>
        <p className="text-sm text-gray-500">Tente selecionar outra data</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedSlots).map(([period, slots]) => {
        if (slots.length === 0) return null

        const periodInfo = getPeriodInfo(period as "morning" | "afternoon" | "evening")
        const PeriodIcon = periodInfo.icon

        return (
          <div key={period} className="space-y-3">
            <div className="flex items-center gap-2">
              <PeriodIcon className={`w-4 h-4 ${periodInfo.color}`} />
              <Badge variant="secondary" className="text-xs">
                {periodInfo.label}
              </Badge>
              <span className="text-xs text-gray-500">({slots.length} horários)</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.map((slot) => (
                <Button
                  key={slot.time}
                  variant={selectedTime === slot.time ? "default" : "outline"}
                  size="sm"
                  className={`h-10 transition-all duration-200 ${
                    selectedTime === slot.time
                      ? "bg-primary text-primary-foreground shadow-md scale-105"
                      : "hover:bg-gray-50 hover:border-primary/50"
                  }`}
                  onClick={() => onTimeSelect(slot.time)}
                >
                  {slot.displayTime}
                </Button>
              ))}
            </div>
          </div>
        )
      })}

      {selectedTime && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">
              Horário selecionado: {timeSlots.find((slot) => slot.time === selectedTime)?.displayTime}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
