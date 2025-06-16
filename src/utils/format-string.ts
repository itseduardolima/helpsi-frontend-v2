export const formatName = (name: string) => {
  if (!name) return "";

  const prepositions = ["de", "da", "do", "das", "dos", "e"];

  return name
    .toLowerCase()
    .split(" ")
    .map((word, index) => {
      if (prepositions.includes(word) && index > 0) {
        return word;
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};


export const getFirstName = (name: string) => {
  if (!name) return "";
  const firstName = name.split(" ")[0];
  return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
};

export const formatDateFromAPI = (dateString: string) => {
  if (!dateString) return '';
  
  if (dateString.includes('/')) {
    return dateString;
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error('Data inválida:', dateString);
      return '';
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return '';
  }
}

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const safeFormatDate = (date: Date | null | undefined, formatString: string): string => {
  if (!date || isNaN(date.getTime())) {
    return ""
  }
  try {
    return format(date, formatString, { locale: ptBR })
  } catch (error) {
    console.error("Error formatting date:", error)
    return ""
  }
}