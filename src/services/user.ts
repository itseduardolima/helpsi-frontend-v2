import api from '@/src/lib/api';
import type { Me } from '@/src/types/auth';

export const userService = {
  async findUserDetails(): Promise<Me> {
    const response = await api.get<Me>("/user/me");
    return response.data;
  }
}; 