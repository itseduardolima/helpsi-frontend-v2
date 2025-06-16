import api from "@/src/lib/api";
import { Profile } from "../types/profile";
import { Specialty } from "../types/specialty";

export const adminService = {
 
  async getProfiles(): Promise<Profile[]> {
    const response = await api.get<Profile[]>("/user/profile");
    return response.data;
  },

  
  async getSpecialties(): Promise<Specialty[]> {
    const response = await api.get<Specialty[]>("/specialty");
    return response.data;
  },

  async createSpecialty(name: string): Promise<Specialty> {
    const response = await api.post<Specialty>("/specialty", {
      specialty_name: name,
    });
    return response.data;
  },

  async updateSpecialty(id: string, name: string): Promise<Specialty> {
    const response = await api.put<Specialty>(`/specialty/${id}`, {
      specialty_name: name,
    });
    return response.data;
  },

  async deleteSpecialty(id: string): Promise<void> {
    await api.delete(`/specialty/${id}`);
  },
};
