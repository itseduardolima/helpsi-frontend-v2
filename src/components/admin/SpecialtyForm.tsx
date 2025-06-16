import { useState, useEffect } from 'react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';

interface SpecialtyFormProps {
  initialData?: { specialty_name: string };
  onSubmit: (data: { specialty_name: string }) => void;
  isSubmitting?: boolean;
}

export function SpecialtyForm({ initialData, onSubmit, isSubmitting }: SpecialtyFormProps) {
  const [formData, setFormData] = useState({ specialty_name: '' });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="specialty_name">Nome da Especialidade</Label>
        <Input
          id="specialty_name"
          value={formData.specialty_name}
          onChange={(e) => setFormData({ specialty_name: e.target.value })}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {initialData ? "Atualizar" : "Cadastrar"}
      </Button>
    </form>
  );
} 