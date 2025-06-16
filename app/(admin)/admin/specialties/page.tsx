"use client";

import { useState } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Search, Plus, Pencil, Trash2, Stethoscope } from "lucide-react";
import { useSpecialties } from "@/src/hooks/useAdmin";
import { SpecialtyForm } from "@/src/components/admin/SpecialtyForm";
import { ConfirmDialog } from "@/src/components/ui/confirm-dialog";
import { Specialty } from "@/src/types/specialty";
import { toast } from "sonner";
import { SuccessModal } from "@/src/components/ui/success-modal";
import { formatName } from "@/src/utils/format-string";

export default function AdminSpecialtiesPage() {
  const router = useRouter();
  const { isAuthenticated, loading, user } = useAuth();
  const { specialties, isLoading, createSpecialty, updateSpecialty, deleteSpecialty } = useSpecialties();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(null);
  const [deletingSpecialty, setDeletingSpecialty] = useState<Specialty | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: '', message: '' });

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-main"></div>
      </div>
    );
  }

  const filteredSpecialties = specialties?.filter((specialty) =>
    specialty.specialty_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleCreateSpecialty = async (data: { specialty_name: string }) => {
    try {
      await createSpecialty(data.specialty_name);
      setIsAddDialogOpen(false);
      setSuccessMessage({
        title: "Especialidade criada com sucesso!",
        message: "A especialidade foi cadastrada no sistema."
      });
      setShowSuccessModal(true);
    } catch (error) {
      toast.error("Erro ao criar especialidade");
    }
  };

  const handleUpdateSpecialty = async (data: { specialty_name: string }) => {
    if (!editingSpecialty) return;
    try {
      await updateSpecialty({
        id: editingSpecialty.specialty_id,
        name: data.specialty_name,
      });
      setIsDialogOpen(false);
      setEditingSpecialty(null);
      setSuccessMessage({
        title: "Especialidade atualizada com sucesso!",
        message: "As alterações foram salvas no sistema."
      });
      setShowSuccessModal(true);
    } catch (error) {
      toast.error("Erro ao atualizar especialidade");
    }
  };

  const handleDeleteSpecialty = async () => {
    if (!deletingSpecialty) return;
    try {
      await deleteSpecialty(deletingSpecialty.specialty_id);
      setIsDeleteDialogOpen(false);
      setDeletingSpecialty(null);
      setSuccessMessage({
        title: "Especialidade excluída com sucesso!",
        message: "A especialidade foi removida do sistema."
      });
      setShowSuccessModal(true);
    } catch (error) {
      toast.error("Erro ao excluir especialidade");
    }
  };

  const openEditDialog = (specialty: Specialty) => {
    setEditingSpecialty(specialty);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (specialty: Specialty) => {
    setDeletingSpecialty(specialty);
    setIsDeleteDialogOpen(true);
  };

  const openAddDialog = () => {
    setIsAddDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Especialidades</h1>
          <p className="text-gray-500 mt-1">Gerencie as especialidades do sistema</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingSpecialty(null);
          }
        }}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5" />
              Nova Especialidade
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">
                {editingSpecialty ? "Editar Especialidade" : "Nova Especialidade"}
              </DialogTitle>
            </DialogHeader>
            <SpecialtyForm
              initialData={editingSpecialty || undefined}
              onSubmit={editingSpecialty ? handleUpdateSpecialty : handleCreateSpecialty}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar especialidades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white shadow-sm"
          />
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Confirmar Exclusão"
        description={`Tem certeza que deseja excluir a especialidade ${deletingSpecialty?.specialty_name}?`}
        confirmText="Excluir"
        variant="destructive"
        onConfirm={handleDeleteSpecialty}
      />

      <SuccessModal
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        title={successMessage.title}
        message={successMessage.message}
      />

      <div className="rounded-lg border bg-white shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-main border-t-transparent"></div>
          </div>
        ) : !specialties || specialties.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="rounded-full bg-gray-100 p-3">
              <Stethoscope className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhuma especialidade encontrada</h3>
            <p className="mt-1 text-sm text-gray-500">
              Comece adicionando uma nova especialidade ao sistema.
            </p>
            <Button
              onClick={() => openAddDialog()}
              className="mt-4"
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Especialidade
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Nome</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Ações</th>
                </tr>
              </thead>
              <tbody>
                {specialties.map((specialty) => (
                  <tr key={specialty.specialty_id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{formatName(specialty.specialty_name)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(specialty)}
                          className="h-8 w-8 text-gray-500 hover:text-primary-main"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(specialty)}
                          className="h-8 w-8 text-gray-500 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 