import { z } from "zod";

export const userSchema = z.object({
    user_name: z.string().min(1, "Nome é obrigatório"),
    user_email: z.string().email("E-mail inválido"),
    user_password: z.string().optional(),
    user_profile_id: z.string().min(1, "Perfil é obrigatório"),
    user_date_of_birth: z.string().min(1, "Data de nascimento é obrigatória"),
    user_genre: z.string().min(1, "Gênero é obrigatório"),
    user_phone: z.string().optional(),
    user_rg: z.string().optional(),
    user_cpf: z.string().optional(),
    user_crp: z.string().optional(),
    user_enrollment: z.string().optional(),
    specialty_ids: z.array(z.string()).optional(),
  });