import {
  format,
  formatDistanceToNow,
  isToday,
  isTomorrow,
  isPast,
} from "date-fns";
import { ptBR } from "date-fns/locale";

export const getDateLabel = (date: Date) => {
  if (isToday(date)) return "Hoje";
  if (isTomorrow(date)) return "Amanhã";
  return format(date, "EEEE", { locale: ptBR });
};

export const getTimeUntil = (date: Date) => {
  if (isPast(date)) return null;
  return formatDistanceToNow(date, { locale: ptBR, addSuffix: true });
};
