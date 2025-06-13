
import type { Scheduling, CreateSchedulingDto, UpdateSchedulingDto, SchedulingFilter } from '@/src/types/scheduling';
import api from '../lib/api';

export const schedulingService = {
  async create(data: CreateSchedulingDto): Promise<Scheduling> {
    const response = await api.post<Scheduling>('/scheduling', data);
    return response.data;
  },

  async update(id: string, data: UpdateSchedulingDto): Promise<Scheduling> {
    const response = await api.put<Scheduling>(`/scheduling/${id}`, data);
    return response.data;
  },

  async findAll(filter: SchedulingFilter): Promise<Scheduling[]> {
    const response = await api.get<Scheduling[]>('/scheduling', { params: filter });
    return response.data;
  },

  async findOne(id: string): Promise<Scheduling> {
    const response = await api.get<Scheduling>(`/scheduling/${id}`);
    return response.data;
  },

  async checkAvailability(date: string): Promise<string[]> {
    const response = await api.get<string[]>('/scheduling/availability', {
      params: { date }
    });
    return response.data;
  }
}; 