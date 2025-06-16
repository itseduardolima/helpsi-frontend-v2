import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { schedulingService } from "../services/scheduling";
import api from "../lib/api";
import { format, isValid } from "date-fns";
import type { SchedulingFilter } from "../types/scheduling";

export function useScheduling(filter: SchedulingFilter) {
  return useQuery({
    queryKey: ["schedulings", filter],
    queryFn: () => schedulingService.findAll(filter),
  });
}

export interface AvailableTime {
  time: string;
}

export function useAvailableTimes(date: Date, psychologistId: string) {
  return useQuery<AvailableTime[]>({
    queryKey: ["availability", date, psychologistId],
    queryFn: async () => {
      if (!date || !psychologistId) return [];
      if (!isValid(date)) {
        console.warn("Invalid date provided to useAvailableTimes:", date);
        return [];
      }

      try {
        const response = await api.get<AvailableTime[]>(
          "/scheduling/availability",
          {
            params: {
              date: format(date, "yyyy-MM-dd"),
              psychologist_id: psychologistId,
            },
          }
        );

        return response.data || [];
      } catch (error) {
        console.error("Error fetching available times:", error);
        return [];
      }
    },
    enabled: !!date && !!psychologistId && isValid(date),
    initialData: [],
  });
}

export function useCreateScheduling() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/scheduling", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedulings"] });
    },
  });
}
