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
    onError: () => {
      console.error("Erro ao criar usuário");
      toast.error( "Erro ao criar usuário");
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
    onError: () => {
      console.error("Erro ao atualizar usuário");
      toast.error( "Erro ao atualizar usuário");
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
    onError: () => {
      console.error("Erro ao excluir usuário");
      toast.error( "Erro ao excluir usuário");
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
