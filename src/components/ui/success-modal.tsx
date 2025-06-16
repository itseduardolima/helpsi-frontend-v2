import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface SuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  message?: string;
  type?: 'success' | 'error';
}

export function SuccessModal({ 
  open, 
  onOpenChange, 
  title = "Sucesso!", 
  message = "Operação realizada com sucesso.",
  type = 'success'
}: SuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex flex-col items-center gap-4 py-4">
            <div className={cn(
              "rounded-full p-3",
              type === 'success' ? "bg-green-100" : "bg-red-100"
            )}>
              <CheckCircle2 className={cn(
                "h-12 w-12",
                type === 'success' ? "text-green-600" : "text-red-600"
              )} />
            </div>
            <span className={cn(
              "text-xl font-semibold",
              type === 'success' ? "text-green-600" : "text-red-600"
            )}>
              {title}
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center gap-2 pb-6">
          <p className="text-center text-gray-600">{message}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
} 