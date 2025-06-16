import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreateUserDto, UpdateUserDto, User } from "@/src/types/user";
import api from "../lib/api";

export function useUsers() {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get<{ items: User[] }>("/user");
      return response.data.items;
    },
  });

  const { mutate: changeUserStatus } = useMutation({
    mutationFn: async (userId: string) => {
      const response = await api.patch(`/user/status/${userId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      toast.error("Erro ao alterar status");
    },
  });

  const createUser = useMutation({
    mutationFn: async (data: CreateUserDto) => {
      const response = await api.post("/user", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      console.error("Erro ao criar usuário:", error);
      toast.error(error.response?.data?.message || "Erro ao criar usuário");
    },
  });

  const updateUser = useMutation({
    mutationFn: async ({
      userId,
      data,
    }: {
      userId: string;
      data: UpdateUserDto;
    }) => {
      const response = await api.put(`/user/${userId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      console.error("Erro ao atualizar usuário:", error);
      toast.error(error.response?.data?.message || "Erro ao atualizar usuário");
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      const response = await api.delete(`/user/${userId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      console.error("Erro ao excluir usuário:", error);
      toast.error(error.response?.data?.message || "Erro ao excluir usuário");
    },
  });

  return {
    users,
    isLoading,
    createUser,
    updateUser,
    deleteUser,
    changeUserStatus
  };
}

export function useMe() {
  return useQuery<User>({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await api.get<User>("/user/me");
      return response.data;
    },
  });
}
