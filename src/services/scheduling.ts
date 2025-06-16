
import type { CreateSchedulingDto, Scheduling, SchedulingFilter } from '@/src/types/scheduling';
import api from '../lib/api';

export const schedulingService = {
  async create(data: CreateSchedulingDto): Promise<Scheduling> {
    const response = await api.post<Scheduling>('/scheduling', data);
    return response.data;
  },

  async findAll(filter: SchedulingFilter): Promise<Scheduling[]> {
    const response = await api.get<{ items: Scheduling[] }>('/scheduling', { params: filter });
    return response.data.items;
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