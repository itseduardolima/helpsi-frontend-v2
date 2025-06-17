"use client";

import { useState } from "react";
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
import { Switch } from "@/src/components/ui/switch";
import { Search, Pencil, Trash2, UserPlus } from "lucide-react";
import { UserForm } from "@/src/components/admin/UserForm";
import { User } from "@/src/types/user";
import { toast } from "sonner";
import { SuccessModal } from "@/src/components/ui/success-modal";
import { formatName } from "@/src/utils/format-string";
import { useUsers } from "@/src/hooks/useUsers";

export default function AdminUsersPage() {

  const { users, isLoading, changeUserStatus, deleteUser } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState({
    title: "",
    message: "",
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const filteredUsers = Array.isArray(users) ? users.filter((user: User) =>
    user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_email.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  console.log(users);

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser.mutateAsync(userId);
      setSuccessMessage({
        title: "Usuário excluído com sucesso!",
        message: "O usuário foi removido do sistema."
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast.error('Erro ao excluir usuário');
    }
  };

  const handleChangeStatus = (userId: string, currentStatus: boolean) => {
    changeUserStatus(userId);
    setSuccessMessage({
      title: "Status atualizado com sucesso!",
      message: `O usuário foi ${currentStatus ? "desativado" : "ativado"} no sistema.`
    });
    setShowSuccessModal(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingUser(null);
    }
  };

  const handleSuccess = (type: 'create' | 'update' | 'delete' | 'status') => {
    setIsDialogOpen(false);
    setEditingUser(null);
    
    const messages = {
      create: {
        title: "Usuário criado com sucesso!",
        message: "O usuário foi cadastrado no sistema."
      },
      update: {
        title: "Usuário atualizado com sucesso!",
        message: "As alterações foram salvas no sistema."
      },
      delete: {
        title: "Usuário excluído com sucesso!",
        message: "O usuário foi removido do sistema."
      },
      status: {
        title: "Status atualizado com sucesso!",
        message: "O status do usuário foi atualizado no sistema."
      }
    };

    setSuccessMessage(messages[type]);
    setShowSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Usuários</h1>
          <p className="text-gray-500 mt-1">Gerencie os usuários do sistema</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-5">
              <UserPlus className="w-5 h-5" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">
                {editingUser ? "Editar Usuário" : "Novo Usuário"}
              </DialogTitle>
            </DialogHeader>
            <UserForm
              initialData={editingUser ? {
                user_id: editingUser.user_id,
                user_name: editingUser.user_name,
                user_email: editingUser.user_email,
                user_profile_id: editingUser.user_profile_id,
                user_status: editingUser.user_status,
                user_first_access: editingUser.user_first_access,
                user_date_of_birth: editingUser.user_date_of_birth,
                user_phone: editingUser.user_phone,
                user_genre: editingUser.user_genre,
                user_rg: editingUser.user_rg,
                user_cpf: editingUser.user_cpf,
                user_crp: editingUser.user_crp,
                user_enrollment: editingUser.user_enrollment,
                specialtys: editingUser.specialtys,
              } : undefined}
              onSuccess={() => handleSuccess(editingUser ? 'update' : 'create')}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Nome</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Telefone</TableHead>
              <TableHead className="font-semibold">Data de Nascimento</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.user_id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{formatName(user.user_name)}</TableCell>
                <TableCell>{user.user_email}</TableCell>
                <TableCell>{user.user_phone}</TableCell>
                <TableCell>
                  {new Date(user.user_date_of_birth).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={user.user_status}
                      onCheckedChange={() => handleChangeStatus(user.user_id, user.user_status)}
                      className="data-[state=checked]:bg-green-500"
                    />
                    <span className={`text-sm ${user.user_status ? 'text-green-600' : 'text-red-600'}`}>
                      {user.user_status ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(user)}
                      className="h-8 w-8 text-gray-500 hover:text-primary-main"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteUser(user.user_id)}
                      className="h-8 w-8 text-gray-500 hover:text-primary-main"
                    >
                      <Trash2 className="w-4 h-4 " />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <SuccessModal
        open={showSuccessModal}
        onOpenChange={handleCloseSuccessModal}
        title={successMessage.title}
        message={successMessage.message}
      />
    </div>
  );
} 