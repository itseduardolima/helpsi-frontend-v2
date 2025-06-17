export interface CreateUserDto {
  user_name: string;
  user_email: string;
  user_password: string;
  user_profile_id: string;
  user_date_of_birth: string;
  user_phone: string;
  user_genre?: string;
  user_rg?: string;
  user_cpf?: string;
  user_crp?: string;
  user_enrollment?: string;
  specialtys?: { specialty_id: string; specialty_name: string }[];
}

export interface UpdateUserDto {
  user_name?: string;
  user_email?: string;
  user_password?: string;
  user_profile_id?: string;
  user_date_of_birth?: string;
  user_phone?: string;
  user_genre?: string;
  user_rg?: string;
  user_cpf?: string;
  user_crp?: string;
  user_enrollment?: string;
  specialtys?: { specialty_id: string; specialty_name: string }[];
  user_status?: boolean;
  user_first_access?: boolean;
}

export interface User {
  user_id: string;
  user_name: string;
  user_password: string;
  user_email: string;
  user_profile_id: string;
  user_status: boolean;
  user_first_access: boolean;
  user_date_of_birth: string;
  user_phone: string;
  user_genre: string;
  user_rg?: string;
  user_cpf?: string;
  user_crp?: string;
  user_enrollment: string;
  specialtys?: { specialty_id: string; specialty_name: string }[]
  profile: {
    profile_id: number;
    profile_name: string;
  };
}

export interface Payload {
  id: string;
  name: string;
  email: string;
  role: string;
}
