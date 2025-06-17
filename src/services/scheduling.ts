import type {  Scheduling, SchedulingFilter } from '@/src/types/scheduling';
import api from '../lib/api';
import { IMeta } from '../types/meta';

export const schedulingService = {

  async findAll(filter: SchedulingFilter): Promise<IMeta<Scheduling>> {
    const response = await api.get<IMeta<Scheduling>>('/scheduling', { params: filter });
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