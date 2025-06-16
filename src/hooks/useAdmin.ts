import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/src/services/admin";
import { toast } from "sonner";

export function useProfiles() {
  const { data: profiles, isLoading } = useQuery({
    queryKey: ["profiles"],
    queryFn: adminService.getProfiles,
  });

  return { profiles, isLoading };
}

export function useSpecialties() {
  const queryClient = useQueryClient();

  const { data: specialties, isLoading } = useQuery({
    queryKey: ["specialties"],
    queryFn: adminService.getSpecialties,
  });

  const { mutate: createSpecialty } = useMutation({
    mutationFn: adminService.createSpecialty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specialties"] });
    },
    onError: () => {
      toast.error("Erro ao criar especialidade");
    },
  });

  const { mutate: updateSpecialty } = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      adminService.updateSpecialty(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specialties"] });
    },
    onError: () => {
      toast.error("Erro ao atualizar especialidade");
    },
  });

  const { mutate: deleteSpecialty } = useMutation({
    mutationFn: adminService.deleteSpecialty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specialties"] });
    },
    onError: () => {
      toast.error("Erro ao excluir especialidade");
    },
  });

  return {
    specialties,
    isLoading,
    createSpecialty,
    updateSpecialty,
    deleteSpecialty,
  };
}
