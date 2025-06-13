'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useCreateScheduling } from '../hooks/useCreateScheduling';
import { useCheckAvailability } from '../hooks/useCheckAvailability';
import { useAuth } from '@/src/hooks/useAuth';
import { Textarea } from './ui/textarea';
import { Calendar, Clock, MessageSquare, User } from 'lucide-react';
import { Label } from './ui/label';

export function SchedulingForm() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('');
  const [reason, setReason] = useState('');
  const [preferredDoctor, setPreferredDoctor] = useState('');

  const { mutate: createScheduling, isPending } = useCreateScheduling();
  const { data: availableTimes, isLoading: isLoadingAvailability } = useCheckAvailability({
    date,
    type,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createScheduling(
      {
        date,
        time,
        type,
        patientId: user?.id || '',
        doctorId: preferredDoctor || '1',
        reason,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setDate('');
          setTime('');
          setType('');
          setReason('');
          setPreferredDoctor('');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Novo Agendamento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Agendar Consulta
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            Preencha os dados abaixo para agendar sua consulta
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
          <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium">
              Tipo de Consulta
              </Label>
            <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o tipo de consulta" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="psicologo">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      <span>Psicólogo</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="psiquiatra">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>Psiquiatra</span>
                    </div>
                  </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">
                Data Preferencial
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              id="date"
              type="date"
              value={date}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
                  className="pl-10"
            />
              </div>
          </div>

          <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-medium">
                Horário Preferencial
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Select value={time} onValueChange={setTime} disabled={!date || !type}>
                  <SelectTrigger className="w-full pl-10">
                <SelectValue placeholder="Selecione o horário" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingAvailability ? (
                  <SelectItem value="loading" disabled>
                    Carregando horários...
                  </SelectItem>
                ) : availableTimes && availableTimes.length > 0 ? (
                  availableTimes.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    Nenhum horário disponível
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredDoctor" className="text-sm font-medium">
                Profissional Preferencial (opcional)
              </Label>
              <Select value={preferredDoctor} onValueChange={setPreferredDoctor}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um profissional" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Dra. Ana Silva</SelectItem>
                  <SelectItem value="2">Dr. João Santos</SelectItem>
                  <SelectItem value="3">Dra. Maria Oliveira</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason" className="text-sm font-medium">
                Motivo da Consulta
              </Label>
              <Textarea
                id="reason"
                placeholder="Descreva brevemente o motivo da sua consulta..."
                value={reason}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={isPending || !date || !time || !type}
            >
              {isPending ? 'Agendando...' : 'Confirmar Agendamento'}
          </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 