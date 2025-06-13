export interface Scheduling {
  id: string;
  date: string;
  time: string;
  type: string;
  status: string;
  patientId: string;
  doctorId: string;
  reason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSchedulingDto {
  date: string;
  time: string;
  type: string;
  patientId: string;
  doctorId: string;
  reason?: string;
}

export interface UpdateSchedulingDto {
  date?: string;
  time?: string;
  type?: string;
  status?: string;
  reason?: string;
}

export interface SchedulingFilter {
  patientId?: string;
  doctorId?: string;
  date?: string;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
} 