import { Psychologist } from "./psychologist";

export interface Scheduling {
  scheduling_id: string;
  start_time: string;
  end_time: string;
  registrant_name: string;
  createdAt: string;
  updatedAt: string;
  isCancelled: boolean;
  currentPsychologist: Psychologist;
}

export interface CreateSchedulingDto {
  duration: number;
  select_date_time: Date;
  patient_id: string;
  psychologist_id: string;
  registrant_name: string;
}

export interface SchedulingFilter {
  patient_id?: string;
  psychologist_id?: string;
  page?: number;
  limit?: number;
}