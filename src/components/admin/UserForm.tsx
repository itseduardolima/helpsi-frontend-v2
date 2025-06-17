"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useSpecialties } from "@/src/hooks/useSpecialty"
import { toast } from "sonner"
import type { CreateUserDto, UpdateUserDto } from "@/src/types/user"
import { SuccessModal } from "@/src/components/ui/success-modal"
import { useUsers } from "@/src/hooks/useUsers"
import { formatDateFromAPI } from "@/src/utils/format-string"
import { userSchema } from "@/src/schemas/userSchema"

interface UserFormData {
  user_id?: string
  user_name: string
  user_email: string
  user_password: string
  user_profile_id: string
  user_phone: string
  user_crp: string
  user_enrollment: string
  user_date_of_birth: string
  user_genre: string
  user_rg: string
  user_cpf: string
  specialtys: { specialty_id: string; specialty_name: string }[]
  user_status: boolean
  user_first_access: boolean
}

interface UserFormProps {
  initialData?: {
    user_id?: string
    user_name: string
    user_email: string
    user_profile_id: string
    user_status: boolean
    user_first_access: boolean
    user_phone?: string
    user_rg?: string
    user_cpf?: string
    user_crp?: string
    user_enrollment?: string
    user_date_of_birth?: string
    user_genre?: string
    specialtys?: { specialty_id: string; specialty_name: string }[]
  }
  onSuccess?: () => void
}

function BasicInfoForm({
  formData,
  setFormData,
}: {
  formData: UserFormData
  setFormData: (data: UserFormData) => void
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="user_name">Nome</Label>
          <Input
            id="user_name"
            value={formData.user_name}
            onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="user_email">E-mail</Label>
          <Input
            id="user_email"
            type="email"
            value={formData.user_email}
            onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="user_password">Senha {formData.user_id && "(deixe em branco para manter a atual)"}</Label>
          <Input
            id="user_password"
            type="password"
            value={formData.user_password}
            onChange={(e) => setFormData({ ...formData, user_password: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="user_profile_id">Perfil</Label>
          <Select
            value={formData.user_profile_id ? String(formData.user_profile_id) : undefined}
            onValueChange={(value) => setFormData({ ...formData, user_profile_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o perfil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Administrador</SelectItem>
              <SelectItem value="2">Paciente</SelectItem>
              <SelectItem value="3">Psicólogo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

function PersonalInfoForm({
  formData,
  setFormData,
}: {
  formData: UserFormData
  setFormData: (data: UserFormData) => void
}) {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value
    if (date) {
      const [year, month, day] = date.split("-")
      const formattedDate = `${day}/${month}/${year}`
      setFormData({ ...formData, user_date_of_birth: formattedDate })
    } else {
      setFormData({ ...formData, user_date_of_birth: "" })
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="user_phone">Telefone</Label>
          <Input
            id="user_phone"
            value={formData.user_phone}
            onChange={(e) => setFormData({ ...formData, user_phone: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="user_date_of_birth">Data de Nascimento</Label>
          <Input
            id="user_date_of_birth"
            type="date"
            value={
              formData.user_date_of_birth
                ? new Date(formData.user_date_of_birth.split("/").reverse().join("-")).toISOString().split("T")[0]
                : ""
            }
            onChange={handleDateChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="user_genre">Gênero</Label>
          <Select
            value={formData.user_genre}
            onValueChange={(value) => setFormData({ ...formData, user_genre: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o gênero" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">Masculino</SelectItem>
              <SelectItem value="FEMALE">Feminino</SelectItem>
              <SelectItem value="OTHER">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="user_rg">RG</Label>
          <Input
            id="user_rg"
            value={formData.user_rg}
            onChange={(e) => setFormData({ ...formData, user_rg: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="user_cpf">CPF</Label>
          <Input
            id="user_cpf"
            value={formData.user_cpf}
            onChange={(e) => setFormData({ ...formData, user_cpf: e.target.value })}
          />
        </div>
      </div>
    </div>
  )
}

function PsychologistInfoForm({
  formData,
  setFormData,
}: {
  formData: UserFormData
  setFormData: (data: UserFormData) => void
}) {
  const { data: specialties, isLoading: isLoadingSpecialties } = useSpecialties()

  const handleSpecialtyChange = (value: string) => {
    const specialtyId = value
    if (formData.specialtys?.some((s) => s.specialty_id === specialtyId)) {
      setFormData({
        ...formData,
        specialtys: formData.specialtys?.filter((s) => s.specialty_id !== specialtyId),
      })
    } else {
      setFormData({
        ...formData,
        specialtys: [...(formData.specialtys || []), { specialty_id: specialtyId, specialty_name: "" }],
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="user_crp">CRP</Label>
          <Input
            id="user_crp"
            value={formData.user_crp}
            onChange={(e) => setFormData({ ...formData, user_crp: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="user_enrollment">Matrícula</Label>
          <Input
            id="user_enrollment"
            value={formData.user_enrollment}
            onChange={(e) => setFormData({ ...formData, user_enrollment: e.target.value })}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Especialidades</Label>
          <div className="space-y-2">
            <Select value="" onValueChange={handleSpecialtyChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma especialidade" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingSpecialties ? (
                  <SelectItem value="loading" disabled>
                    Carregando especialidades...
                  </SelectItem>
                ) : (specialties || []).length > 0 ? (
                  (specialties || [])
                    .filter((specialty) => !formData.specialtys?.some((s) => s.specialty_id === specialty.specialty_id))
                    .map((specialty) => (
                      <SelectItem key={specialty.specialty_id} value={specialty.specialty_id}>
                        {specialty.specialty_name}
                      </SelectItem>
                    ))
                ) : (
                  <SelectItem value="none" disabled>
                    Nenhuma especialidade disponível
                  </SelectItem>
                )}
              </SelectContent>
            </Select>

            {formData.specialtys?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.specialtys?.map((specialty) => {
                  const specialtyName = specialties?.find((s) => s.specialty_id === specialty.specialty_id)?.specialty_name
                  return specialtyName ? (
                    <div
                      key={specialty.specialty_id}
                      className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                    >
                      <span>{specialty.specialty_name}</span>
                      <button
                        type="button"
                        onClick={() => handleSpecialtyChange(specialty.specialty_id)}
                        className="text-primary hover:text-primary/80"
                      >
                        ×
                      </button>
                    </div>
                  ) : null
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingsForm({
  formData,
  setFormData,
}: {
  formData: UserFormData
  setFormData: (data: UserFormData) => void
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="user_status">Status</Label>
          <Select
            value={String(formData.user_status)}
            onValueChange={(value) => setFormData({ ...formData, user_status: value === "true" })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Ativo</SelectItem>
              <SelectItem value="false">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="user_first_access">Primeiro Acesso</Label>
          <Select
            value={String(formData.user_first_access)}
            onValueChange={(value) => setFormData({ ...formData, user_first_access: value === "true" })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione se é primeiro acesso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Sim</SelectItem>
              <SelectItem value="false">Não</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export function UserForm({ initialData, onSuccess }: UserFormProps) {
  const [currentTab, setCurrentTab] = useState("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const { data: specialties = [] } = useSpecialties()

  const [formData, setFormData] = useState<UserFormData>(() => {
    return {
      user_id: initialData?.user_id || "",
      user_name: initialData?.user_name || "",
      user_email: initialData?.user_email || "",
      user_password: "",
      user_profile_id: initialData?.user_profile_id ? String(initialData.user_profile_id) : "",
      user_phone: initialData?.user_phone || "",
      user_crp: initialData?.user_crp || "",
      user_enrollment: initialData?.user_enrollment || "",
      user_date_of_birth: initialData?.user_date_of_birth ? formatDateFromAPI(initialData.user_date_of_birth) : "",
      user_genre: initialData?.user_genre || "",
      user_rg: initialData?.user_rg || "",
      user_cpf: initialData?.user_cpf || "",
      specialtys: initialData?.specialtys || [],
      user_status: initialData?.user_status ?? true,
      user_first_access: initialData?.user_first_access ?? true,
    }
  })

  const { createUser, updateUser } = useUsers()

  const isPsychologist = Number(formData.user_profile_id) === 3

  useEffect(() => {
    if (!isPsychologist && currentTab === "psychologist") {
      setCurrentTab("basic")
    }
  }, [isPsychologist, currentTab])

  useEffect(() => {
    if (isPsychologist && initialData?.user_id) {
      setCurrentTab("psychologist")
    }
  }, [isPsychologist, initialData?.user_id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const validation = userSchema.safeParse(formData)
    if (!validation.success) {
      const firstError = validation.error.errors[0]?.message || "Dados inválidos"
      toast.error(firstError)
      setIsSubmitting(false)
      return
    }

    if (initialData?.user_id) {
      const specialtys = specialties
        .filter(() => formData.specialtys?.some((s) => s.specialty_id === s.specialty_id))
        .map((s) => ({
          specialty_id: s.specialty_id,
          specialty_name: s.specialty_name,
        }))

      const updateData: UpdateUserDto = {
        user_name: formData.user_name,
        user_email: formData.user_email,
        user_profile_id: formData.user_profile_id.toString(),
        user_date_of_birth: formData.user_date_of_birth,
        user_phone: formData.user_phone,
        user_password: formData.user_password || undefined,
        user_genre: formData.user_genre,
        user_rg: formData.user_rg,
        user_cpf: formData.user_cpf,
        user_crp: formData.user_crp,
        user_enrollment: formData.user_enrollment,
        specialtys,
        user_status: formData.user_status,
        user_first_access: formData.user_first_access,
      }

      updateUser.mutate(
        {
          userId: initialData.user_id,
          data: updateData,
        },
        {
          onSuccess: () => {
            setShowSuccessModal(true)
            setIsSubmitting(false)
            onSuccess?.()
          },
          onError: () => {
            setIsSubmitting(false)
            toast.error("Erro ao atualizar usuário")
          },
        },
      )
    } else {
      if (!formData.user_password) {
        toast.error("A senha é obrigatória para novo usuário")
        setIsSubmitting(false)
        return
      }

      const specialtys = specialties
        .filter(() => formData.specialtys?.some((s) => s.specialty_id === s.specialty_id))
        .map((s) => ({
          specialty_id: s.specialty_id,
          specialty_name: s.specialty_name,
        }))

      const createData: CreateUserDto = {
        user_name: formData.user_name,
        user_email: formData.user_email,
        user_password: formData.user_password,
        user_profile_id: formData.user_profile_id.toString(),
        user_date_of_birth: formData.user_date_of_birth,
        user_phone: formData.user_phone,
        user_genre: formData.user_genre,
        user_rg: formData.user_rg,
        user_cpf: formData.user_cpf,
        user_crp: formData.user_crp,
        user_enrollment: formData.user_enrollment,
        specialtys,
      }

      createUser.mutate(createData, {
        onSuccess: () => {
          setShowSuccessModal(true)
          setIsSubmitting(false)
          onSuccess?.()
        },
        onError: () => {
          setIsSubmitting(false)
        },
      })
    }
  }

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex gap-2 border-b pb-4">
        <Button
          type="button"
          variant={currentTab === "basic" ? "default" : "outline"}
          onClick={() => setCurrentTab("basic")}
        >
          Básico
        </Button>
        <Button
          type="button"
          variant={currentTab === "personal" ? "default" : "outline"}
          onClick={() => setCurrentTab("personal")}
        >
          Pessoal
        </Button>
        {isPsychologist && (
          <Button
            type="button"
            variant={currentTab === "psychologist" ? "default" : "outline"}
            onClick={() => setCurrentTab("psychologist")}
          >
            Psicólogo
          </Button>
        )}
        <Button
          type="button"
          variant={currentTab === "settings" ? "default" : "outline"}
          onClick={() => setCurrentTab("settings")}
        >
          Configurações
        </Button>
      </div>

      <div className="min-h-[400px]">
        {currentTab === "basic" && <BasicInfoForm formData={formData} setFormData={setFormData} />}

        {currentTab === "personal" && <PersonalInfoForm formData={formData} setFormData={setFormData} />}

        {currentTab === "psychologist" && isPsychologist && (
          <PsychologistInfoForm formData={formData} setFormData={setFormData} />
        )}

        {currentTab === "settings" && <SettingsForm formData={formData} setFormData={setFormData} />}
      </div>

      <Button className="w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : initialData ? "Atualizar" : "Criar"}
      </Button>

      <SuccessModal
        open={showSuccessModal}
        onOpenChange={handleCloseSuccessModal}
        title="Sucesso!"
        message={`Usuário ${initialData ? "atualizado" : "criado"} com sucesso!`}
        type="success"
      />
    </form>
  )
}
